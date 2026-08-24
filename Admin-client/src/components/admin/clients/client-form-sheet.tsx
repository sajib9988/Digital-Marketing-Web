'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { createClient, updateClient } from '@/services/api/clients.service'
import { ApiError } from '@/lib/api/safe-json'
import type { Client } from '@/types/api'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
})

type ClientValues = z.infer<typeof clientSchema>

const emptyValues: ClientValues = {
  name: '',
  companyName: '',
  email: '',
  phone: '',
  website: '',
  logo: '',
  description: '',
}

type ClientFormSheetProps = {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ClientFormSheet({
  client,
  open,
  onOpenChange,
  onSuccess,
}: ClientFormSheetProps) {
  const isEdit = !!client
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        client
          ? {
              name: client.name,
              companyName: client.companyName ?? '',
              email: client.email ?? '',
              phone: client.phone ?? '',
              website: client.website ?? '',
              logo: client.logo ?? '',
              description: client.description ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, client, reset])

  const onSubmit = async (values: ClientValues) => {
    try {
      if (isEdit) {
        await updateClient(client.id, values)
        toast.success('Client updated')
      } else {
        await createClient(values)
        toast.success('Client created')
      }
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
          <SheetTitle>{isEdit ? 'Edit client' : 'Add client'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update this client’s details.' : 'Add a new client.'}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" {...register('name')} />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="companyName">Company name</FieldLabel>
              <Input id="companyName" {...register('companyName')} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...register('email')} />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" {...register('phone')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input id="website" {...register('website')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="logo">Logo URL</FieldLabel>
              <Input id="logo" {...register('logo')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" rows={3} {...register('description')} />
            </Field>
          </FieldGroup>
          <SheetFooter className="px-0">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
            <SheetClose render={<Button type="button" variant="outline" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
