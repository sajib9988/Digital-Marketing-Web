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
import { createPost, updatePost } from '@/services/payload.service'
import { textToLexical, lexicalToText } from '@/lib/payload/lexical-text'
import { ApiError } from '@/lib/api/safe-json'
import type { MediaOption } from '@/services/payload.service'
import type { Post } from '@payload-types'

const NONE_IMAGE = '__none__'

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string(),
  content: z.string().min(1, 'Content is required'),
  author: z.string().optional(),
  status: z.enum(['draft', 'published']),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

type PostValues = z.infer<typeof postSchema>

const emptyValues: PostValues = {
  title: '',
  slug: '',
  excerpt: '',
  featuredImage: NONE_IMAGE,
  content: '',
  author: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
}

type PostFormSheetProps = {
  post: Post | null
  mediaOptions: MediaOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PostFormSheet({
  post,
  mediaOptions,
  open,
  onOpenChange,
  onSuccess,
}: PostFormSheetProps) {
  const isEdit = !!post
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        post
          ? {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt ?? '',
              featuredImage: post.featuredImage ? String(post.featuredImage) : NONE_IMAGE,
              content: lexicalToText(post.content),
              author: post.author ?? '',
              status: post.status ?? 'draft',
              seoTitle: post.seo?.title ?? '',
              seoDescription: post.seo?.description ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, post, reset])

  const onSubmit = async (values: PostValues) => {
    const data = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      featuredImage:
        values.featuredImage === NONE_IMAGE ? null : Number(values.featuredImage),
      content: textToLexical(values.content),
      author: values.author,
      status: values.status,
      publishedAt: values.status === 'published' ? new Date().toISOString() : undefined,
      seo: { title: values.seoTitle, description: values.seoDescription },
    }

    try {
      if (isEdit) {
        await updatePost(String(post.id), data)
        toast.success('Post updated')
      } else {
        await createPost(data)
        toast.success('Post created')
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
          <SheetTitle>{isEdit ? 'Edit post' : 'Add post'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update this blog post.' : 'Create a new blog post.'}
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
            <Field>
              <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
              <Textarea id="excerpt" rows={2} {...register('excerpt')} />
            </Field>
            <Field>
              <FieldLabel>Featured image</FieldLabel>
              <Controller
                control={control}
                name="featuredImage"
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
            <Field>
              <FieldLabel htmlFor="content">Content</FieldLabel>
              <Textarea id="content" rows={8} {...register('content')} />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="author">Author</FieldLabel>
              <Input id="author" {...register('author')} />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
