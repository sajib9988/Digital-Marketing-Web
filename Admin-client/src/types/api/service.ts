export type Service = {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string
  icon: string | null
  image: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CreateServiceInput = {
  title: string
  slug: string
  shortDescription?: string
  description: string
  icon?: string
  image?: string
  isActive?: boolean
  sortOrder?: number
}

export type UpdateServiceInput = Partial<CreateServiceInput>
