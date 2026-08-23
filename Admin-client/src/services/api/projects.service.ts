'use server'

import { getApiUrl, getAuthHeaders } from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@/types/api'

export async function getProjects(
  params?: Record<string, string>,
): Promise<Project[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${getApiUrl()}/projects${query}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Project[]>(res)
}

export async function getProjectById(id: string): Promise<Project> {
  const res = await fetch(`${getApiUrl()}/projects/${id}`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<Project>(res)
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const res = await fetch(`${getApiUrl()}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Project>(res)
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
): Promise<Project> {
  const res = await fetch(`${getApiUrl()}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  })
  return safeJson<Project>(res)
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getApiUrl()}/projects/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}
