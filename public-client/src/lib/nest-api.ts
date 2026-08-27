import type { Service } from '@/types/service'

// Read-only access to the NestJS API — the public site only ever fetches
// active/published business data. The one write path (contact form) goes
// through src/actions/submit-contact.ts instead, not this file.

function getBaseUrl(): string {
  const url = process.env.API_URL
  if (!url) {
    throw new Error('API_URL environment variable is not set')
  }
  return url
}

export async function getActiveServices(): Promise<Service[]> {
  const res = await fetch(`${getBaseUrl()}/services/public`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`NestJS API error ${res.status} for /services/public`)
  }
  return res.json() as Promise<Service[]>
}
