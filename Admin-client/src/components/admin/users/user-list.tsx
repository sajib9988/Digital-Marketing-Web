'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { UserFormSheet } from './user-form-sheet'
import { deleteUser } from '@/services/api/users.service'
import type { User, UserRole } from '@/types/api'

const roleVariant: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
  SUPER_ADMIN: 'default',
  ADMIN: 'secondary',
  USER: 'outline',
}

export function UserList({ data, currentUserId }: { data: User[]; currentUserId: string }) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (user: User) => {
    setEditing(user)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<User>[] = [
    { id: 'name', header: 'Name', cell: (row) => row.name },
    { id: 'email', header: 'Email', cell: (row) => row.email },
    {
      id: 'role',
      header: 'Role',
      cell: (row) => (
        <Badge variant={roleVariant[row.role]}>{row.role.replaceAll('_', ' ')}</Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) =>
        row.id === currentUserId ? null : (
          <RowActions
            itemLabel={row.name}
            onEdit={() => openEdit(row)}
            onDelete={() => deleteUser(row.id)}
            onDeleted={() => router.refresh()}
          />
        ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}>
          <Plus />
          Add user
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        getSearchText={(row) => `${row.name} ${row.email}`}
        searchPlaceholder="Search users…"
      />
      <UserFormSheet
        user={editing}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
