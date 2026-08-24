'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  createTestimonial,
  updateTestimonial,
} from '@/services/api/testimonials.service'
import { ApiError } from '@/lib/api/safe-json'
import type { Client, Testimonial } from '@/types/api'

const testimonialSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  content: z.string().min(1, 'Content is required'),
  rating: z.number().int().min(1).max(5),
  isPublished: z.boolean(),
})

type TestimonialValues = z.infer<typeof testimonialSchema>

const emptyValues: TestimonialValues = {
  clientId: '',
  content: '',
  rating: 5,
  isPublished: true,
}

type TestimonialFormSheetProps = {
  testimonial: Testimonial | null
  clients: Client[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TestimonialFormSheet({
  testimonial,
  clients,
  open,
  onOpenChange,
  onSuccess,
}: TestimonialFormSheetProps) {
  const isEdit = !!testimonial
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        testimonial
          ? {
              clientId: testimonial.clientId,
              content: testimonial.content,
              rating: testimonial.rating ?? 5,
              isPublished: testimonial.isPublished,
            }
          : emptyValues,
      )
    }
  }, [open, testimonial, reset])

  const onSubmit = async (values: TestimonialValues) => {
    try {
      if (isEdit) {
        await updateTestimonial(testimonial.id, values)
        toast.success('Testimonial updated')
      } else {
        await createTestimonial(values)
        toast.success('Testimonial created')
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
          <SheetTitle>{isEdit ? 'Edit testimonial' : 'Add testimonial'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update this testimonial.' : 'Add a new client testimonial.'}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={!!errors.clientId}>
              <FieldLabel htmlFor="clientId">Client</FieldLabel>
              <Controller
                control={control}
                name="clientId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="clientId" className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.clientId]} />
            </Field>
            <Field data-invalid={!!errors.content}>
              <FieldLabel htmlFor="content">Content</FieldLabel>
              <Textarea id="content" rows={4} {...register('content')} />
              <FieldError errors={[errors.content]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="rating">Rating (1–5)</FieldLabel>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                {...register('rating', { valueAsNumber: true })}
              />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="isPublished">Published</FieldLabel>
              <Switch
                id="isPublished"
                checked={watch('isPublished')}
                onCheckedChange={(checked) => setValue('isPublished', checked)}
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
