import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ACCESS_TOKEN_COOKIE = 'accessToken'
const REFRESH_TOKEN_COOKIE = 'refreshToken'
const ACCESS_TOKEN_MAX_AGE_SECONDS = 30 * 60
const PUBLIC_PATHS = ['/admin/login', '/admin/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

  if (token) {
    try {
      await jwtVerify(token, secretKey())
      return NextResponse.next()
    } catch {
      // Falls through to the refresh attempt below.
    }
  }

  const refreshed = await tryRefresh(request)
  if (refreshed) {
    return refreshed
  }

  return redirectToLogin(request)
}

async function tryRefresh(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  const apiUrl = process.env.API_URL
  if (!refreshToken || !apiUrl) {
    return null
  }

  try {
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    })
    if (!res.ok) {
      return null
    }

    const { accessToken } = (await res.json()) as { accessToken: string }
    const response = NextResponse.next()
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
      path: '/',
    })
    return response
  } catch {
    return null
  }
}

function secretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  return new TextEncoder().encode(secret)
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('from', request.nextUrl.pathname)
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete(ACCESS_TOKEN_COOKIE)
  response.cookies.delete(REFRESH_TOKEN_COOKIE)
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
