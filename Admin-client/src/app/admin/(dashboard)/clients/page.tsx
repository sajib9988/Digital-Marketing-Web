import { getClients } from '@/services/api/clients.service'
import { ClientList } from '@/components/admin/clients/client-list'
import { ApiErrorState } from '@/components/admin/api-error-state'
import { ApiError } from '@/lib/api/safe-json'

export default async function ClientsPage() {
  let clients
  try {
    clients = await getClients()
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
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-muted-foreground">
          Manage clients linked to projects and testimonials.
        </p>
      </div>
      <ClientList data={clients} />
    </div>
  )
}
