'use server'

// The only POST this app makes — everything else is a read. Relays the
// contact form (plus its Turnstile token) to NestJS's public /contacts
// endpoint; NestJS is the one that verifies the token with Cloudflare.

export type ContactFormInput = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  turnstileToken: string
}

export type ContactFormResult = { success: true } | { success: false; error: string }

export async function submitContactForm(
  input: ContactFormInput,
): Promise<ContactFormResult> {
  const apiUrl = process.env.API_URL
  if (!apiUrl) {
    return { success: false, error: 'Contact form is not configured' }
  }

  try {
    const res = await fetch(`${apiUrl}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as
        | { message?: string | string[] }
        | null
      const message = Array.isArray(body?.message)
        ? body.message.join(', ')
        : (body?.message ?? 'Unable to send your message right now')
      return { success: false, error: message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Unable to reach the server — please try again' }
  }
}
