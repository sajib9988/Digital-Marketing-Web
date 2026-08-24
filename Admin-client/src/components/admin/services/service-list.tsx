'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { ServiceFormSheet } from './service-form-sheet'
import { deleteService } from '@/services/api/services.service'
import type { Service } from '@/types/api'

export function ServiceList({ data }: { data: Service[] }) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditing(service)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Service>[] = [
    { id: 'title', header: 'Title', cell: (row) => row.title },
    { id: 'slug', header: 'Slug', cell: (row) => row.slug },
    {
      id: 'isActive',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { id: 'sortOrder', header: 'Order', cell: (row) => row.sortOrder },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) => (
        <RowActions
          itemLabel={row.title}
          onEdit={() => openEdit(row)}
          onDelete={() => deleteService(row.id)}
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
          Add service
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        getSearchText={(row) => `${row.title} ${row.slug}`}
        searchPlaceholder="Search services…"
      />
      <ServiceFormSheet
        service={editing}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
