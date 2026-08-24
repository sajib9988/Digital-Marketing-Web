'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { TestimonialFormSheet } from './testimonial-form-sheet'
import { deleteTestimonial } from '@/services/api/testimonials.service'
import type { Client, Testimonial } from '@/types/api'

export function TestimonialList({
  data,
  clients,
}: {
  data: Testimonial[]
  clients: Client[]
}) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)

  const clientNameById = useMemo(
    () => new Map(clients.map((client) => [client.id, client.name])),
    [clients],
  )

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Testimonial>[] = [
    {
      id: 'client',
      header: 'Client',
      cell: (row) => clientNameById.get(row.clientId) ?? 'Unknown',
    },
    {
      id: 'content',
      header: 'Content',
      cell: (row) => <span className="line-clamp-2">{row.content}</span>,
    },
    { id: 'rating', header: 'Rating', cell: (row) => row.rating ?? '—' },
    {
      id: 'isPublished',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isPublished ? 'default' : 'secondary'}>
          {row.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) => (
        <RowActions
          itemLabel="Testimonial"
          onEdit={() => openEdit(row)}
          onDelete={() => deleteTestimonial(row.id)}
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
          Add testimonial
        </Button>
      </div>
      <DataTable columns={columns} data={data} getRowId={(row) => row.id} />
      <TestimonialFormSheet
        testimonial={editing}
        clients={clients}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
