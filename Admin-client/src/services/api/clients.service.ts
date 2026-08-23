'use server'

import { getApiUrl, getAuthHeaders } from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type { Client, CreateClientInput, UpdateClientInput } from '@/types/api'

export async function getClients(
  params?: Record<string, string>,
): Promise<Client[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${getApiUrl()}/clients${query}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Client[]>(res)
}

export async function getClientById(id: string): Promise<Client> {
  const res = await fetch(`${getApiUrl()}/clients/${id}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Client>(res)
}

export async function createClient(
  input: CreateClientInput,
): Promise<Client> {
  const res = await fetch(`${getApiUrl()}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Client>(res)
}

export async function updateClient(
  id: string,
  input: UpdateClientInput,
): Promise<Client> {
  const res = await fetch(`${getApiUrl()}/clients/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Client>(res)
}

export async function deleteClient(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getApiUrl()}/clients/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}
