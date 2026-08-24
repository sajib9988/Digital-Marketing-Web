'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { ProjectFormSheet } from './project-form-sheet'
import { deleteProject } from '@/services/api/projects.service'
import type { Client, Project } from '@/types/api'

export function ProjectList({ data, clients }: { data: Project[]; clients: Client[] }) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Project>[] = [
    { id: 'title', header: 'Title', cell: (row) => row.title },
    {
      id: 'category',
      header: 'Category',
      cell: (row) => <Badge variant="secondary">{row.category.replaceAll('_', ' ')}</Badge>,
    },
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
      id: 'isFeatured',
      header: 'Featured',
      cell: (row) => (row.isFeatured ? 'Yes' : '—'),
    },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) => (
        <RowActions
          itemLabel={row.title}
          onEdit={() => openEdit(row)}
          onDelete={() => deleteProject(row.id)}
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
          Add project
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        getSearchText={(row) => `${row.title} ${row.slug}`}
        searchPlaceholder="Search projects…"
      />
      <ProjectFormSheet
        project={editing}
        clients={clients}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
