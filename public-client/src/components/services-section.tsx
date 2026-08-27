import { ServicesMarquee } from './services-marquee'
import { ServiceCard } from './service-card'
import type { Service } from '@/types/service'

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="flex flex-col gap-12 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          What we do
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          A full-stack marketing team, on demand — strategy, creative, and
          performance under one roof.
        </p>
      </div>

      <ServicesMarquee services={services} />

      {services.length > 0 ? (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Services will appear here once they’re added in the admin dashboard.
        </p>
      )}
    </section>
  )
}
