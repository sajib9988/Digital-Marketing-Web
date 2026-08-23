export const PROJECT_CATEGORIES = [
  'WEB_DEVELOPMENT',
  'DIGITAL_MARKETING',
  'SEO',
  'SOCIAL_MEDIA_MARKETING',
  'BRANDING',
  'GRAPHIC_DESIGN',
  'E_COMMERCE',
  'OTHER',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export type Project = {
  id: string
  title: string
  slug: string
  description: string
  category: ProjectCategory
  images: string[]
  technologies: string[]
  projectUrl: string | null
  isFeatured: boolean
  isPublished: boolean
  clientId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateProjectInput = {
  title: string
  slug: string
  description: string
  category: ProjectCategory
  images?: string[]
  technologies?: string[]
  projectUrl?: string
  isFeatured?: boolean
  isPublished?: boolean
  clientId?: string
}

export type UpdateProjectInput = Partial<CreateProjectInput>
