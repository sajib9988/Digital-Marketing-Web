import type { Service } from '@/types/service'

// Two rows scrolling opposite directions, each row's content duplicated once
// so the CSS animation (see globals.css) loops seamlessly.
export function ServicesMarquee({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return null
  }

  const row = (direction: 'ltr' | 'rtl') => (
    <div
      className={`flex w-max shrink-0 gap-4 ${
        direction === 'rtl' ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
      }`}
    >
      {[...services, ...services].map((service, index) => (
        <span
          key={`${service.id}-${index}`}
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium whitespace-nowrap text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {service.title}
        </span>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4 overflow-hidden py-4">
      {row('rtl')}
      {row('ltr')}
    </div>
  )
}
