import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Digital Agency. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/contact" className="hover:text-zinc-950 dark:hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
