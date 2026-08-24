'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { ClientFormSheet } from './client-form-sheet'
import { deleteClient } from '@/services/api/clients.service'
import type { Client } from '@/types/api'

export function ClientList({ data }: { data: Client[] }) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditing(client)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Client>[] = [
    { id: 'name', header: 'Name', cell: (row) => row.name },
    { id: 'companyName', header: 'Company', cell: (row) => row.companyName ?? '—' },
    { id: 'email', header: 'Email', cell: (row) => row.email ?? '—' },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) => (
        <RowActions
          itemLabel={row.name}
          onEdit={() => openEdit(row)}
          onDelete={() => deleteClient(row.id)}
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
          Add client
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        getSearchText={(row) => `${row.name} ${row.companyName ?? ''} ${row.email ?? ''}`}
        searchPlaceholder="Search clients…"
      />
      <ClientFormSheet
        client={editing}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
