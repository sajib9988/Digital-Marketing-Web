import { getProjects } from '@/services/api/projects.service'
import { getClients } from '@/services/api/clients.service'
import { ProjectList } from '@/components/admin/projects/project-list'
import { ApiErrorState } from '@/components/admin/api-error-state'
import { ApiError } from '@/lib/api/safe-json'

export default async function ProjectsPage() {
  let projects, clients
  try {
    ;[projects, clients] = await Promise.all([getProjects(), getClients()])
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
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-muted-foreground">
          Manage portfolio projects shown on the public site.
        </p>
      </div>
      <ProjectList data={projects} clients={clients} />
    </div>
  )
}
