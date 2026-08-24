export type Media = {
  id: number
  url: string
  alt: string
  caption?: string | null
}

export type Page = {
  id: number
  title: string
  slug: string
  hero?: {
    heading?: string | null
    subheading?: string | null
    image?: Media | null
    ctaText?: string | null
    ctaLink?: string | null
  }
  // Lexical editor-state JSON — rendering it into HTML is a separate concern
  // (e.g. @payloadcms/richtext-lexical's serializer), out of scope here.
  body?: unknown
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?: Media | null
  }
  updatedAt: string
  createdAt: string
}

export type Post = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: Media | null
  content?: unknown
  author?: string | null
  publishedAt?: string | null
  status?: 'draft' | 'published' | null
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?: Media | null
  }
  updatedAt: string
  createdAt: string
}

export type NavigationItem = {
  label: string
  url: string
  newTab?: boolean | null
}

export type Navigation = {
  items?: NavigationItem[] | null
}

export type SiteSeo = {
  defaultTitle?: string | null
  titleSuffix?: string | null
  defaultDescription?: string | null
  defaultOgImage?: Media | null
  robotsIndexable?: boolean | null
}
