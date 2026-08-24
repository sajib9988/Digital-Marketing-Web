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
import { createProject, updateProject } from '@/services/api/projects.service'
import { ApiError } from '@/lib/api/safe-json'
import { PROJECT_CATEGORIES, type Client, type Project } from '@/types/api'

const NONE_CLIENT = '__none__'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(PROJECT_CATEGORIES),
  images: z.string().optional(),
  technologies: z.string().optional(),
  projectUrl: z.string().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  clientId: z.string(),
})

type ProjectValues = z.infer<typeof projectSchema>

const emptyValues: ProjectValues = {
  title: '',
  slug: '',
  description: '',
  category: 'OTHER',
  images: '',
  technologies: '',
  projectUrl: '',
  isFeatured: false,
  isPublished: true,
  clientId: NONE_CLIENT,
}

type ProjectFormSheetProps = {
  project: Project | null
  clients: Client[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ProjectFormSheet({
  project,
  clients,
  open,
  onOpenChange,
  onSuccess,
}: ProjectFormSheetProps) {
  const isEdit = !!project
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        project
          ? {
              title: project.title,
              slug: project.slug,
              description: project.description,
              category: project.category,
              images: project.images.join('\n'),
              technologies: project.technologies.join(', '),
              projectUrl: project.projectUrl ?? '',
              isFeatured: project.isFeatured,
              isPublished: project.isPublished,
              clientId: project.clientId ?? NONE_CLIENT,
            }
          : emptyValues,
      )
    }
  }, [open, project, reset])

  const onSubmit = async (values: ProjectValues) => {
    const payload = {
      ...values,
      images: values.images
        ? values.images.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      technologies: values.technologies
        ? values.technologies.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      clientId: values.clientId === NONE_CLIENT ? undefined : values.clientId,
    }

    try {
      if (isEdit) {
        await updateProject(project.id, payload)
        toast.success('Project updated')
      } else {
        await createProject(payload)
        toast.success('Project created')
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
          <SheetTitle>{isEdit ? 'Edit project' : 'Add project'}</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Update this project’s details.' : 'Create a new portfolio project.'}
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
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" rows={4} {...register('description')} />
              <FieldError errors={[errors.description]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replaceAll('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="clientId">Client</FieldLabel>
              <Controller
                control={control}
                name="clientId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="clientId" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_CLIENT}>No client</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="images">Images (one URL per line)</FieldLabel>
              <Textarea id="images" rows={3} {...register('images')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="technologies">Technologies (comma separated)</FieldLabel>
              <Input id="technologies" {...register('technologies')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="projectUrl">Project URL</FieldLabel>
              <Input id="projectUrl" {...register('projectUrl')} />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
              <Switch
                id="isFeatured"
                checked={watch('isFeatured')}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
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
