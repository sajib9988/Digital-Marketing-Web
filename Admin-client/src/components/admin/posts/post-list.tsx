'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { PostFormSheet } from './post-form-sheet'
import { deletePost } from '@/services/payload.service'
import type { MediaOption } from '@/services/payload.service'
import type { Post } from '@payload-types'

export function PostList({
  data,
  mediaOptions,
}: {
  data: Post[]
  mediaOptions: MediaOption[]
}) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (post: Post) => {
    setEditing(post)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Post>[] = [
    { id: 'title', header: 'Title', cell: (row) => row.title },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'published' ? 'default' : 'secondary'}>
          {row.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    { id: 'author', header: 'Author', cell: (row) => row.author ?? '—' },
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
          onDelete={() => deletePost(String(row.id))}
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
          Add post
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => String(row.id)}
        getSearchText={(row) => `${row.title} ${row.slug}`}
        searchPlaceholder="Search posts…"
      />
      <PostFormSheet
        post={editing}
        mediaOptions={mediaOptions}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
