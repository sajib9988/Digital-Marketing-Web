import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { Service } from '@/types/service'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        <Sparkles className="size-5" aria-hidden />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
          {service.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {service.shortDescription ?? service.description}
        </p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        Learn more
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
