import type { CollectionConfig } from 'payload'

// Editorial media for Hero/Section/Blog/Portfolio/Case Study/OG images (CLAUDE.md
// section 7). Files are offloaded to Cloudinary via the cloudStoragePlugin adapter
// configured in payload.config.ts — nothing is persisted to the VPS filesystem.
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alternative text for accessibility and SEO.',
      },
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
