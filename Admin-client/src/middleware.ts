import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ACCESS_TOKEN_COOKIE = 'accessToken'
const PUBLIC_PATHS = ['/admin/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

  if (!token) {
    return redirectToLogin(request)
  }

  try {
    await jwtVerify(token, secretKey())
    return NextResponse.next()
  } catch {
    return redirectToLogin(request)
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
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
