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
import { Switch } from '@/components/ui/switch'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { createService, updateService } from '@/services/api/services.service'
import { ApiError } from '@/lib/api/safe-json'
import type { Service } from '@/types/api'

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
})

type ServiceValues = z.infer<typeof serviceSchema>

const emptyValues: ServiceValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  icon: '',
  image: '',
  isActive: true,
  sortOrder: 0,
}

type ServiceFormSheetProps = {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ServiceFormSheet({
  service,
  open,
  onOpenChange,
  onSuccess,
}: ServiceFormSheetProps) {
  const isEdit = !!service
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        service
          ? {
              title: service.title,
              slug: service.slug,
              shortDescription: service.shortDescription ?? '',
              description: service.description,
              icon: service.icon ?? '',
              image: service.image ?? '',
              isActive: service.isActive,
              sortOrder: service.sortOrder,
            }
          : emptyValues,
      )
    }
  }, [open, service, reset])

  const onSubmit = async (values: ServiceValues) => {
    try {
      if (isEdit) {
        await updateService(service.id, values)
        toast.success('Service updated')
      } else {
        await createService(values)
        toast.success('Service created')
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
          <SheetTitle>{isEdit ? 'Edit service' : 'Add service'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update this service’s details.'
              : 'Create a new service offering.'}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" {...register('title')} />
              <FieldError errors={[errors.title]} />
            </Field>
            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input id="slug" {...register('slug')} />
              <FieldError errors={[errors.slug]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="shortDescription">Short description</FieldLabel>
              <Input id="shortDescription" {...register('shortDescription')} />
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" rows={4} {...register('description')} />
              <FieldError errors={[errors.description]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="icon">Icon</FieldLabel>
              <Input id="icon" {...register('icon')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="image">Image URL</FieldLabel>
              <Input id="image" {...register('image')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="sortOrder">Sort order</FieldLabel>
              <Input
                id="sortOrder"
                type="number"
                {...register('sortOrder', { valueAsNumber: true })}
              />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="isActive">Active</FieldLabel>
              <Switch
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
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
