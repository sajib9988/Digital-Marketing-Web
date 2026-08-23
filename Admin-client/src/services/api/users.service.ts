'use server'

import { getApiUrl, getAuthHeaders } from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type { CreateUserInput, UpdateUserInput, User } from '@/types/api'

export async function getUsers(
  params?: Record<string, string>,
): Promise<User[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${getApiUrl()}/users${query}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<User[]>(res)
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${getApiUrl()}/users/${id}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<User>(res)
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const res = await fetch(`${getApiUrl()}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<User>(res)
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  const res = await fetch(`${getApiUrl()}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<User>(res)
}

export async function deleteUser(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getApiUrl()}/users/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}
