import type { GlobalConfig } from 'payload'

export const SiteSEO: GlobalConfig = {
  slug: 'site-seo',
  fields: [
    { name: 'defaultTitle', type: 'text' },
    { name: 'titleSuffix', type: 'text' },
    { name: 'defaultDescription', type: 'textarea' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'robotsIndexable', type: 'checkbox', defaultValue: true },
  ],
}
