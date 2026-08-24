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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { createPage, updatePage } from '@/services/payload.service'
import { textToLexical, lexicalToText } from '@/lib/payload/lexical-text'
import { ApiError } from '@/lib/api/safe-json'
import type { MediaOption } from '@/services/payload.service'
import type { Page } from '@payload-types'

const NONE_IMAGE = '__none__'

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  heroImage: z.string(),
  heroCtaText: z.string().optional(),
  heroCtaLink: z.string().optional(),
  body: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoOgImage: z.string(),
})

type PageValues = z.infer<typeof pageSchema>

const emptyValues: PageValues = {
  title: '',
  slug: '',
  heroHeading: '',
  heroSubheading: '',
  heroImage: NONE_IMAGE,
  heroCtaText: '',
  heroCtaLink: '',
  body: '',
  seoTitle: '',
  seoDescription: '',
  seoOgImage: NONE_IMAGE,
}

type PageFormSheetProps = {
  page: Page | null
  mediaOptions: MediaOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PageFormSheet({
  page,
  mediaOptions,
  open,
  onOpenChange,
  onSuccess,
}: PageFormSheetProps) {
  const isEdit = !!page
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PageValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        page
          ? {
              title: page.title,
              slug: page.slug,
              heroHeading: page.hero?.heading ?? '',
              heroSubheading: page.hero?.subheading ?? '',
              heroImage: page.hero?.image ? String(page.hero.image) : NONE_IMAGE,
              heroCtaText: page.hero?.ctaText ?? '',
              heroCtaLink: page.hero?.ctaLink ?? '',
              body: lexicalToText(page.body),
              seoTitle: page.seo?.title ?? '',
              seoDescription: page.seo?.description ?? '',
              seoOgImage: page.seo?.ogImage ? String(page.seo.ogImage) : NONE_IMAGE,
            }
          : emptyValues,
      )
    }
  }, [open, page, reset])

  const onSubmit = async (values: PageValues) => {
    const data = {
      title: values.title,
      slug: values.slug,
      hero: {
        heading: values.heroHeading,
        subheading: values.heroSubheading,
        image: values.heroImage === NONE_IMAGE ? null : Number(values.heroImage),
        ctaText: values.heroCtaText,
        ctaLink: values.heroCtaLink,
      },
      body: values.body ? textToLexical(values.body) : undefined,
      seo: {
        title: values.seoTitle,
        description: values.seoDescription,
        ogImage: values.seoOgImage === NONE_IMAGE ? null : Number(values.seoOgImage),
      },
    }

    try {
      if (isEdit) {
        await updatePage(String(page.id), data)
        toast.success('Page updated')
      } else {
        await createPage(data)
        toast.success('Page created')
      }
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong')
    }
  }

  const imageSelect = (name: 'heroImage' | 'seoOgImage', label: string) => (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
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
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit page' : 'Add page'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update this page.' : 'Create a new page.'}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          noValidate
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" {...register('title')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input id="slug" {...register('slug')} />
            </Field>

            <FieldSeparator>Hero</FieldSeparator>
            <Field>
              <FieldLabel htmlFor="heroHeading">Heading</FieldLabel>
              <Input id="heroHeading" {...register('heroHeading')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="heroSubheading">Subheading</FieldLabel>
              <Input id="heroSubheading" {...register('heroSubheading')} />
            </Field>
            {imageSelect('heroImage', 'Hero image')}
            <Field>
              <FieldLabel htmlFor="heroCtaText">CTA text</FieldLabel>
              <Input id="heroCtaText" {...register('heroCtaText')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="heroCtaLink">CTA link</FieldLabel>
              <Input id="heroCtaLink" {...register('heroCtaLink')} />
            </Field>

            <FieldSeparator>Body</FieldSeparator>
            <Field>
              <Textarea rows={8} {...register('body')} />
            </Field>

            <FieldSeparator>SEO</FieldSeparator>
            <Field>
              <FieldLabel htmlFor="seoTitle">SEO title</FieldLabel>
              <Input id="seoTitle" {...register('seoTitle')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="seoDescription">SEO description</FieldLabel>
              <Textarea id="seoDescription" rows={3} {...register('seoDescription')} />
            </Field>
            {imageSelect('seoOgImage', 'OG image')}
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
