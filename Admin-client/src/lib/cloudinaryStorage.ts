import path from 'path'
import cloudinaryPkg from 'cloudinary'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import type { FileData, TypeWithID } from 'payload'

const { v2: cloudinary } = cloudinaryPkg

type CloudinaryAdapterOptions = {
  apiKey: string
  apiSecret: string
  cloudName: string
  folder: string
}

// Cloudinary public_ids only need to be stable and unique per file — Payload
// already de-duplicates filenames within a collection, so deriving the
// public_id straight from the (sanitized) filename means handleDelete can
// recompute the same id later without needing to persist it separately.
const sanitizeSegment = (segment: string) => segment.replace(/[^a-zA-Z0-9/_-]/g, '-')

const toPublicId = (folder: string, filename: string) => {
  const { name } = path.parse(filename)
  return `${folder}/${sanitizeSegment(name)}`
}

export const cloudinaryAdapter = (options: CloudinaryAdapterOptions): Adapter => {
  cloudinary.config({
    api_key: options.apiKey,
    api_secret: options.apiSecret,
    cloud_name: options.cloudName,
    secure: true,
  })

  return ({ collection, prefix }) => {
    const folder = [options.folder, collection.slug, prefix].filter(Boolean).join('/')

    return {
      name: 'cloudinary',

      handleUpload: async ({ data, file }) => {
        const publicId = toPublicId(folder, file.filename)

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              invalidate: true,
              overwrite: true,
              public_id: publicId,
              resource_type: 'image',
            },
            (error, uploadResult) => {
              if (error || !uploadResult) {
                reject(error ?? new Error('Cloudinary upload returned no result'))
                return
              }
              resolve(uploadResult)
            },
          )
          uploadStream.end(file.buffer)
        })

        const isMainFile = file.filename === data?.filename
        if (isMainFile) {
          return { url: result.secure_url }
        }

        const sizes = (data?.sizes ?? {}) as Record<string, { filename?: string } | undefined>
        const sizeKey = Object.entries(sizes).find(([, size]) => size?.filename === file.filename)?.[0]

        if (!sizeKey) {
          return { url: result.secure_url }
        }

        // Only `url` is set here — the plugin deep-merges this into the existing
        // sizes[sizeKey] entry, which already has filename/width/height/mimeType
        // from Payload's own sharp-generated resize step.
        return { sizes: { [sizeKey]: { url: result.secure_url } } } as unknown as Partial<
          FileData & TypeWithID
        >
      },

      handleDelete: async ({ filename }) => {
        const publicId = toPublicId(folder, filename)
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        } catch (error) {
          // A failed cloud delete shouldn't block deleting the Payload document itself.
          console.error(`Cloudinary: failed to delete ${publicId}`, error)
        }
      },

      staticHandler: async (_req, { params }) => {
        const publicId = toPublicId(folder, params.filename)
        return Response.redirect(cloudinary.url(publicId, { secure: true }), 302)
      },
    }
  }
}
