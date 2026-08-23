import type { CollectionConfig } from 'payload'

// Structured fields (not a block-based builder) — confirmed scope for the
// custom dashboard's /admin/pages screen.
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'ctaText', type: 'text' },
        { name: 'ctaLink', type: 'text' },
      ],
    },
    { name: 'body', type: 'richText' },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
