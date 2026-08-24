import { redirect } from 'next/navigation'
import { getUsers } from '@/services/api/users.service'
import { getSessionUser } from '@/lib/api/session'
import { UserList } from '@/components/admin/users/user-list'
import { ApiErrorState } from '@/components/admin/api-error-state'
import { ApiError } from '@/lib/api/safe-json'

export default async function UsersPage() {
  const session = await getSessionUser()
  if (session?.role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard')
  }

  let users
  try {
    users = await getUsers()
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
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground">
          Manage admin accounts and promote users to admin.
        </p>
      </div>
      <UserList data={users} currentUserId={session.id} />
    </div>
  )
}
