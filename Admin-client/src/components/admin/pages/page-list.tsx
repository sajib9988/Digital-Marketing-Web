'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { PageFormSheet } from './page-form-sheet'
import { deletePage } from '@/services/payload.service'
import type { MediaOption } from '@/services/payload.service'
import type { Page } from '@payload-types'

export function PageList({
  data,
  mediaOptions,
}: {
  data: Page[]
  mediaOptions: MediaOption[]
}) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Page | null>(null)

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (page: Page) => {
    setEditing(page)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Page>[] = [
    { id: 'title', header: 'Title', cell: (row) => row.title },
    { id: 'slug', header: 'Slug', cell: (row) => row.slug },
    {
      id: 'updatedAt',
      header: 'Updated',
      cell: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) => (
        <RowActions
          itemLabel={row.title}
          onEdit={() => openEdit(row)}
          onDelete={() => deletePage(String(row.id))}
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
          Add page
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => String(row.id)}
        getSearchText={(row) => `${row.title} ${row.slug}`}
        searchPlaceholder="Search pages…"
      />
      <PageFormSheet
        page={editing}
        mediaOptions={mediaOptions}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
