'use server'

import { cookies } from 'next/headers'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getApiUrl,
} from '@/lib/api/auth-headers'
import { safeJson } from '@/lib/api/safe-json'
import type { SessionUser } from '@/lib/api/session'

// Must match backend/src/auth/auth.service.ts's ACCESS_TOKEN_TTL_SECONDS /
// REFRESH_TOKEN_TTL_SECONDS.
const ACCESS_TOKEN_MAX_AGE_SECONDS = 30 * 60
const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${getApiUrl()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}

export async function login(email: string, password: string) {
  const res = await fetch(`${getApiUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })
  return safeJson<{ challengeToken: string }>(res)
}

export async function resendOtp(challengeToken: string) {
  const res = await fetch(`${getApiUrl()}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeToken }),
    cache: 'no-store',
  })
  return safeJson<{ success: boolean }>(res)
}

type VerifyOtpResult = {
  user: SessionUser
  // false when the account authenticated successfully but its role (USER)
  // isn't allowed into the admin dashboard — no session cookies are set.
  allowed: boolean
}

export async function verifyOtp(
  challengeToken: string,
  code: string,
): Promise<VerifyOtpResult> {
  const res = await fetch(`${getApiUrl()}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeToken, code }),
    cache: 'no-store',
  })

  const { accessToken, refreshToken, user } = await safeJson<{
    accessToken: string
    refreshToken: string
    user: SessionUser
  }>(res)

  if (user.role === 'USER') {
    return { user, allowed: false }
  }

  const store = await cookies()
  store.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  })
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  })

  return { user, allowed: true }
}

export async function logout() {
  const store = await cookies()
  store.delete(ACCESS_TOKEN_COOKIE)
  store.delete(REFRESH_TOKEN_COOKIE)
}
