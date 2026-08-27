'use client'

import { useEffect, useId, useRef } from 'react'
import Script from 'next/script'

// Minimal Cloudflare Turnstile wrapper — no extra dependency, just the
// official widget script + window.turnstile.render(), per Cloudflare's docs.
// Verification of the resulting token always happens server-side (NestJS),
// never here — this component only produces the token.
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void },
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerId = useId().replace(/:/g, '')
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) {
      return
    }

    const render = () => {
      if (!window.turnstile || widgetIdRef.current) {
        return
      }
      widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': () => onToken(''),
      })
    }

    if (window.turnstile) {
      render()
    } else {
      // The script may still be loading — Script's onLoad (below) handles
      // the common case; this covers a fast remount racing the load event.
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval)
          render()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [siteKey, containerId, onToken])

  if (!siteKey) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Spam protection is not configured for this environment.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div id={containerId} />
    </>
  )
}
