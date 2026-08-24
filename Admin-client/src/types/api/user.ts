export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'USER'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role?: UserRole
}

export type UpdateUserInput = Partial<CreateUserInput>
