import { getServices } from '@/services/api/services.service'
import { ServiceList } from '@/components/admin/services/service-list'
import { ApiErrorState } from '@/components/admin/api-error-state'
import { ApiError } from '@/lib/api/safe-json'

export default async function ServicesPage() {
  let services
  try {
    services = await getServices()
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
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-muted-foreground">
          Manage the services offered on the public site.
        </p>
      </div>
      <ServiceList data={services} />
    </div>
  )
}
