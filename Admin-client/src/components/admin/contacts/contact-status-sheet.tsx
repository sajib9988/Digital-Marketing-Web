'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel } from '@/components/ui/field'
import { updateContact } from '@/services/api/contacts.service'
import { ApiError } from '@/lib/api/safe-json'
import { CONTACT_STATUSES, type Contact, type ContactStatus } from '@/types/api'

type ContactStatusSheetProps = {
  contact: Contact | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ContactStatusSheet({
  contact,
  open,
  onOpenChange,
  onSuccess,
}: ContactStatusSheetProps) {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<{
    status: ContactStatus
  }>({ defaultValues: { status: 'NEW' } })

  useEffect(() => {
    if (open && contact) {
      reset({ status: contact.status })
    }
  }, [open, contact, reset])

  if (!contact) {
    return null
  }

  const onSubmit = async (values: { status: ContactStatus }) => {
    try {
      await updateContact(contact.id, values)
      toast.success('Contact updated')
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{contact.subject || contact.name}</SheetTitle>
          <SheetDescription>
            From {contact.name} ({contact.email})
            {contact.phone ? ` · ${contact.phone}` : ''}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <SheetFooter className="px-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Update status'}
              </Button>
              <SheetClose render={<Button type="button" variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
