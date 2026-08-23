'use server'

import { getApiUrl, getAuthHeaders } from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type {
  CreateServiceInput,
  Service,
  UpdateServiceInput,
} from '@/types/api'

export async function getServices(
  params?: Record<string, string>,
): Promise<Service[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${getApiUrl()}/services${query}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Service[]>(res)
}

export async function getServiceById(id: string): Promise<Service> {
  const res = await fetch(`${getApiUrl()}/services/${id}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Service>(res)
}

export async function createService(
  input: CreateServiceInput,
): Promise<Service> {
  const res = await fetch(`${getApiUrl()}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Service>(res)
}

export async function updateService(
  id: string,
  input: UpdateServiceInput,
): Promise<Service> {
  const res = await fetch(`${getApiUrl()}/services/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Service>(res)
}

export async function deleteService(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getApiUrl()}/services/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}
