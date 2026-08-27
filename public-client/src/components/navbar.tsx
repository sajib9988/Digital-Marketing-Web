'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import type { NavigationItem } from '@/types/payload'

export function Navbar({ items }: { items: NavigationItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Digital<span className="text-indigo-600 dark:text-indigo-400">Agency</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              target={item.newTab ? '_blank' : undefined}
              rel={item.newTab ? 'noopener noreferrer' : undefined}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 md:inline-block dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400"
        >
          Get in touch
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-zinc-200 px-4 py-4 md:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-zinc-950 px-4 py-2 text-center text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
            >
              Get in touch
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
