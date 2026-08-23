import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { PayloadAdmins } from '../collections/PayloadAdmins'
import { Media } from '../collections/Media'
import { cloudinaryAdapter } from '../lib/cloudinaryStorage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),

  collections: [PayloadAdmins, Media],

  admin: {
    user: PayloadAdmins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // REST API only — no GraphQL endpoints, playground, or schema generation.
  graphQL: {
    disable: true,
  },

  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter({
            apiKey: process.env.CLOUDINARY_API_KEY!,
            apiSecret: process.env.CLOUDINARY_API_SECRET!,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
            folder: 'payload-media',
          }),
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],

  secret: process.env.PAYLOAD_SECRET!,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URL!,
    },
  }),

  sharp,
})