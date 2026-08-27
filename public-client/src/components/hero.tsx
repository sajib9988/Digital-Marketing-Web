import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

type HeroProps = {
  heading?: string | null
  subheading?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  imageUrl?: string | null
}

// Falls back to sensible defaults when there's no CMS "home" page yet (e.g.
// Payload has no seeded content) — the site still looks finished either way.
export function Hero({ heading, subheading, ctaText, ctaLink, imageUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-zinc-950 dark:to-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-24 text-center sm:px-6 lg:py-32">
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
          Digital Marketing Agency
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
          {heading ?? 'Grow your brand with data-driven marketing'}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-300">
          {subheading ??
            'We help ambitious businesses plan, launch, and scale campaigns across web, SEO, social, and paid channels.'}
        </p>
        <Link
          href={ctaLink ?? '/contact'}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400"
        >
          {ctaText ?? 'Start your project'}
          <ArrowRight className="size-4" />
        </Link>
        {imageUrl && (
          <div className="mt-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl dark:border-zinc-800">
            <Image
              src={imageUrl}
              alt=""
              width={1200}
              height={675}
              className="h-auto w-full"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
