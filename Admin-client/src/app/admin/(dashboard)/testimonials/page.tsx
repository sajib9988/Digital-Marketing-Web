import { getTestimonials } from '@/services/api/testimonials.service'
import { getClients } from '@/services/api/clients.service'
import { TestimonialList } from '@/components/admin/testimonials/testimonial-list'
import { ApiErrorState } from '@/components/admin/api-error-state'
import { ApiError } from '@/lib/api/safe-json'

export default async function TestimonialsPage() {
  let testimonials, clients
  try {
    ;[testimonials, clients] = await Promise.all([getTestimonials(), getClients()])
  } catch (error) {
    return (
      <ApiErrorState
        message={error instanceof ApiError ? error.message : 'Unknown error'}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <p className="text-muted-foreground">
          Manage client testimonials shown on the public site.
        </p>
      </div>
      <TestimonialList data={testimonials} clients={clients} />
    </div>
  )
}
