'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { updateNavigation } from '@/services/payload.service'
import { ApiError } from '@/lib/api/safe-json'
import type { Navigation } from '@payload-types'

const navigationSchema = z.object({
  items: z.array(
    z.object({
      label: z.string().min(1, 'Label is required'),
      url: z.string().min(1, 'URL is required'),
      newTab: z.boolean(),
    }),
  ),
})

type NavigationValues = z.infer<typeof navigationSchema>

export function NavigationForm({ navigation }: { navigation: Navigation }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<NavigationValues>({
    resolver: zodResolver(navigationSchema),
    defaultValues: {
      items: (navigation.items ?? []).map((item) => ({
        label: item.label,
        url: item.url,
        newTab: item.newTab ?? false,
      })),
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const onSubmit = async (values: NavigationValues) => {
    try {
      await updateNavigation({ items: values.items })
      toast.success('Navigation updated')
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FieldGroup>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2 rounded-md border p-3">
            <Field className="flex-1">
              <FieldLabel htmlFor={`items.${index}.label`}>Label</FieldLabel>
              <Input id={`items.${index}.label`} {...register(`items.${index}.label`)} />
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor={`items.${index}.url`}>URL</FieldLabel>
              <Input id={`items.${index}.url`} {...register(`items.${index}.url`)} />
            </Field>
            <Field orientation="horizontal" className="w-auto">
              <FieldLabel htmlFor={`items.${index}.newTab`}>New tab</FieldLabel>
              <Switch
                id={`items.${index}.newTab`}
                checked={watch(`items.${index}.newTab`)}
                onCheckedChange={(checked) => setValue(`items.${index}.newTab`, checked)}
              />
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
            >
              <Trash2 />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ label: '', url: '', newTab: false })}
        >
          <Plus />
          Add item
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? 'Saving…' : 'Save navigation'}
        </Button>
      </FieldGroup>
    </form>
  )
}
