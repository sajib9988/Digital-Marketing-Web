import type { Navigation, Page, Post, SiteSeo } from '@/types/payload'

// The public site is a separate Next.js app/process from the Admin app that
// hosts Payload, so it can't use Payload's Local API — it talks to Payload's
// REST API over HTTP instead (CLAUDE.md section 9). Only published content
// should ever reach this site; unpublished/draft filtering happens per call
// below where relevant (posts).

type PaginatedResponse<T> = { docs: T[] }

function getBaseUrl(): string {
  const url = process.env.PAYLOAD_API_URL
  if (!url) {
    throw new Error('PAYLOAD_API_URL environment variable is not set')
  }
  return url
}

async function payloadFetch<T>(path: string, revalidateSeconds = 60): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    next: { revalidate: revalidateSeconds },
  })
  if (!res.ok) {
    throw new Error(`Payload API error ${res.status} for ${path}`)
  }
  return res.json() as Promise<T>
}

export async function getPages(): Promise<Page[]> {
  const data = await payloadFetch<PaginatedResponse<Page>>('/pages?depth=2&limit=200')
  return data.docs
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const data = await payloadFetch<PaginatedResponse<Page>>(
    `/pages?depth=2&limit=1&where[slug][equals]=${encodeURIComponent(slug)}`,
  )
  return data.docs[0] ?? null
}

export async function getPublishedPosts(): Promise<Post[]> {
  const data = await payloadFetch<PaginatedResponse<Post>>(
    '/posts?depth=2&limit=200&sort=-publishedAt&where[status][equals]=published',
  )
  return data.docs
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await payloadFetch<PaginatedResponse<Post>>(
    `/posts?depth=2&limit=1&where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published`,
  )
  return data.docs[0] ?? null
}

export async function getNavigation(): Promise<Navigation> {
  return payloadFetch<Navigation>('/globals/navigation?depth=1')
}

export async function getSiteSeo(): Promise<SiteSeo> {
  return payloadFetch<SiteSeo>('/globals/site-seo?depth=2')
}
