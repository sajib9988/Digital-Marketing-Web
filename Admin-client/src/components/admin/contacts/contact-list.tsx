'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/admin/data-table'
import { RowActions } from '@/components/admin/row-actions'
import { ContactStatusSheet } from './contact-status-sheet'
import { deleteContact } from '@/services/api/contacts.service'
import type { Contact, ContactStatus } from '@/types/api'

const statusVariant: Record<ContactStatus, 'default' | 'secondary' | 'outline'> = {
  NEW: 'default',
  READ: 'secondary',
  REPLIED: 'outline',
  ARCHIVED: 'secondary',
}

export function ContactList({ data }: { data: Contact[] }) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<Contact | null>(null)

  const openDetail = (contact: Contact) => {
    setSelected(contact)
    setSheetOpen(true)
  }

  const columns: DataTableColumn<Contact>[] = [
    { id: 'name', header: 'Name', cell: (row) => row.name },
    { id: 'email', header: 'Email', cell: (row) => row.email },
    { id: 'subject', header: 'Subject', cell: (row) => row.subject ?? '—' },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    {
      id: 'createdAt',
      header: 'Received',
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      className: 'w-10',
      cell: (row) => (
        <RowActions
          itemLabel="Contact"
          onEdit={() => openDetail(row)}
          onDelete={() => deleteContact(row.id)}
          onDeleted={() => router.refresh()}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        getSearchText={(row) => `${row.name} ${row.email} ${row.subject ?? ''}`}
        searchPlaceholder="Search contacts…"
      />
      <ContactStatusSheet
        contact={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
