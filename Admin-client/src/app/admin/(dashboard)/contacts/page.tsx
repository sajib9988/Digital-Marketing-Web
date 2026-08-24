import { getContacts } from '@/services/api/contacts.service'
import { ContactList } from '@/components/admin/contacts/contact-list'
import { ApiErrorState } from '@/components/admin/api-error-state'
import { ApiError } from '@/lib/api/safe-json'

export default async function ContactsPage() {
  let contacts
  try {
    contacts = await getContacts()
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
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <p className="text-muted-foreground">
          Messages submitted through the public contact form.
        </p>
      </div>
      <ContactList data={contacts} />
    </div>
  )
}
