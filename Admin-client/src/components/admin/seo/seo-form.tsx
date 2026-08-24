'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { updateSiteSeo } from '@/services/payload.service'
import { ApiError } from '@/lib/api/safe-json'
import type { MediaOption } from '@/services/payload.service'
import type { SiteSeo } from '@payload-types'

const NONE_IMAGE = '__none__'

const seoSchema = z.object({
  defaultTitle: z.string().optional(),
  titleSuffix: z.string().optional(),
  defaultDescription: z.string().optional(),
  defaultOgImage: z.string(),
  robotsIndexable: z.boolean(),
})

type SeoValues = z.infer<typeof seoSchema>

export function SeoForm({
  seo,
  mediaOptions,
}: {
  seo: SiteSeo
  mediaOptions: MediaOption[]
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<SeoValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      defaultTitle: seo.defaultTitle ?? '',
      titleSuffix: seo.titleSuffix ?? '',
      defaultDescription: seo.defaultDescription ?? '',
      defaultOgImage: seo.defaultOgImage ? String(seo.defaultOgImage) : NONE_IMAGE,
      robotsIndexable: seo.robotsIndexable ?? true,
    },
  })

  const onSubmit = async (values: SeoValues) => {
    try {
      await updateSiteSeo({
        defaultTitle: values.defaultTitle,
        titleSuffix: values.titleSuffix,
        defaultDescription: values.defaultDescription,
        defaultOgImage:
          values.defaultOgImage === NONE_IMAGE ? null : Number(values.defaultOgImage),
        robotsIndexable: values.robotsIndexable,
      })
      toast.success('SEO settings updated')
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-lg flex-col gap-4"
      noValidate
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="defaultTitle">Default title</FieldLabel>
          <Input id="defaultTitle" {...register('defaultTitle')} />
        </Field>
        <Field>
          <FieldLabel htmlFor="titleSuffix">Title suffix</FieldLabel>
          <Input id="titleSuffix" {...register('titleSuffix')} />
        </Field>
        <Field>
          <FieldLabel htmlFor="defaultDescription">Default description</FieldLabel>
          <Textarea id="defaultDescription" rows={3} {...register('defaultDescription')} />
        </Field>
        <Field>
          <FieldLabel>Default OG image</FieldLabel>
          <Controller
            control={control}
            name="defaultOgImage"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_IMAGE}>No image</SelectItem>
                  {mediaOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="robotsIndexable">Allow search indexing</FieldLabel>
          <Switch
            id="robotsIndexable"
            checked={watch('robotsIndexable')}
            onCheckedChange={(checked) => setValue('robotsIndexable', checked)}
          />
        </Field>
        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? 'Saving…' : 'Save SEO settings'}
        </Button>
      </FieldGroup>
    </form>
  )
}
