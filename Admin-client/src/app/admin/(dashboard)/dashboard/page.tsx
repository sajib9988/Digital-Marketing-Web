import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getServices } from '@/services/api/services.service'
import { getProjects } from '@/services/api/projects.service'
import { getContacts } from '@/services/api/contacts.service'
import { getCmsOverviewStats } from '@/services/payload.service'
import { getSessionUser } from '@/lib/api/session'

async function safeCount(promise: Promise<{ length: number }>) {
  try {
    return (await promise).length
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const session = await getSessionUser()

  const [serviceCount, projectCount, newContactCount, cms] = await Promise.all([
    safeCount(getServices()),
    safeCount(getProjects()),
    safeCount(getContacts({ status: 'NEW' })),
    getCmsOverviewStats().catch(() => null),
  ])

  const stats = [
    { label: 'Services', value: serviceCount },
    { label: 'Projects', value: projectCount },
    { label: 'New contacts', value: newContactCount },
    { label: 'CMS pages', value: cms?.pageCount ?? null },
    { label: 'Blog posts', value: cms?.postCount ?? null },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{session ? `, ${session.name}` : ''}
        </h1>
        <p className="text-muted-foreground">
          Overview of business data and CMS content.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value ?? '—'}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {stats.some((stat) => stat.value === null) && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            Some stats are unavailable because their data source (NestJS API
            or Payload) couldn’t be reached.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
