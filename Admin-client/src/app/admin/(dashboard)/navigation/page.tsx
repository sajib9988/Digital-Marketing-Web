import { getNavigation } from '@/services/payload.service'
import { NavigationForm } from '@/components/admin/navigation/navigation-form'
import { ApiErrorState } from '@/components/admin/api-error-state'

export default async function NavigationPage() {
  let navigation
  try {
    navigation = await getNavigation()
  } catch (error) {
    return (
      <ApiErrorState
        message={error instanceof Error ? error.message : 'Unknown error'}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Navigation</h1>
        <p className="text-muted-foreground">Manage the site's main navigation menu.</p>
      </div>
      <NavigationForm navigation={navigation} />
    </div>
  )
}
