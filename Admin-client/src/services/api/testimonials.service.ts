'use server'

import { getApiUrl, getAuthHeaders } from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type {
  CreateTestimonialInput,
  Testimonial,
  UpdateTestimonialInput,
} from '@/types/api'

export async function getTestimonials(
  params?: Record<string, string>,
): Promise<Testimonial[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${getApiUrl()}/testimonials${query}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Testimonial[]>(res)
}

export async function getTestimonialById(id: string): Promise<Testimonial> {
  const res = await fetch(`${getApiUrl()}/testimonials/${id}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Testimonial>(res)
}

export async function createTestimonial(
  input: CreateTestimonialInput,
): Promise<Testimonial> {
  const res = await fetch(`${getApiUrl()}/testimonials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Testimonial>(res)
}

export async function updateTestimonial(
  id: string,
  input: UpdateTestimonialInput,
): Promise<Testimonial> {
  const res = await fetch(`${getApiUrl()}/testimonials/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Testimonial>(res)
}

export async function deleteTestimonial(
  id: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`${getApiUrl()}/testimonials/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}
