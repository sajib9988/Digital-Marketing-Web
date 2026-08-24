import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { ACCESS_TOKEN_COOKIE } from './auth-headers'
import type { UserRole } from '@/types/api'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

// Proxy already verifies the token's signature/expiry before any /admin/*
// page renders, so this just decodes the payload for display — no extra
// round-trip to NestJS needed to show who's logged in.
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value
  if (!token) {
    return null
  }

  try {
    const payload = decodeJwt<{
      sub: string
      email: string
      name: string
      role: UserRole
    }>(token)
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }
  } catch {
    return null
  }
}
