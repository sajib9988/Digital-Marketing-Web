import { cookies } from 'next/headers'

export const ACCESS_TOKEN_COOKIE = 'accessToken'

// Server-only helper — reads the admin session token from this app's own
// cookie jar (set at login) and forwards it as a Bearer token to NestJS.
// NestJS never sees or manages this cookie itself.
export async function getAuthHeaders(): Promise<HeadersInit> {
  const store = await cookies()
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getApiUrl(): string {
  const apiUrl = process.env.API_URL
  if (!apiUrl) {
    throw new Error('API_URL environment variable is not set')
  }
  return apiUrl
}
