export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
}

export type UpdateUserInput = Partial<CreateUserInput>
