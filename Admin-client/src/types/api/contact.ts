export const CONTACT_STATUSES = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] as const

export type ContactStatus = (typeof CONTACT_STATUSES)[number]

export type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: ContactStatus
  createdAt: string
  updatedAt: string
}

export type UpdateContactInput = {
  status: ContactStatus
}
