'use server'

import { getApiUrl, getAuthHeaders } from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type { Contact, UpdateContactInput } from '@/types/api'

// Contacts are created by the public site's contact form, not the dashboard —
// admin only reads, updates status, and deletes.
export async function getContacts(
  params?: Record<string, string>,
): Promise<Contact[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${getApiUrl()}/contacts${query}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Contact[]>(res)
}

export async function getContactById(id: string): Promise<Contact> {
  const res = await fetch(`${getApiUrl()}/contacts/${id}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Contact>(res)
}

export async function updateContact(
  id: string,
  input: UpdateContactInput,
): Promise<Contact> {
  const res = await fetch(`${getApiUrl()}/contacts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Contact>(res)
}

export async function deleteContact(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getApiUrl()}/contacts/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}
