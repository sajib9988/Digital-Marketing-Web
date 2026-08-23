export type Client = {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  website: string | null
  logo: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export type CreateClientInput = {
  name: string
  companyName?: string
  email?: string
  phone?: string
  website?: string
  logo?: string
  description?: string
}

export type UpdateClientInput = Partial<CreateClientInput>
