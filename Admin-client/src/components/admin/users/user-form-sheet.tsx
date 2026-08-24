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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { createUser, updateUser } from '@/services/api/users.service'
import { ApiError } from '@/lib/api/safe-json'
import { USER_ROLES, type User } from '@/types/api'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters').optional().or(z.literal('')),
  role: z.enum(USER_ROLES),
})

type UserValues = z.infer<typeof userSchema>

const emptyValues: UserValues = { name: '', email: '', password: '', role: 'USER' }

type UserFormSheetProps = {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserFormSheet({ user, open, onOpenChange, onSuccess }: UserFormSheetProps) {
  const isEdit = !!user
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserValues>({
    resolver: zodResolver(
      isEdit ? userSchema : userSchema.extend({ password: z.string().min(8) }),
    ),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        user
          ? { name: user.name, email: user.email, password: '', role: user.role }
          : emptyValues,
      )
    }
  }, [open, user, reset])

  const onSubmit = async (values: UserValues) => {
    try {
      if (isEdit) {
        const { password, ...rest } = values
        await updateUser(user.id, password ? values : rest)
        toast.success('User updated')
      } else {
        await createUser({ ...values, password: values.password || '' })
        toast.success('User created')
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
          <SheetTitle>{isEdit ? 'Edit user' : 'Add user'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update this account, including its role.'
              : 'Create a new admin account directly.'}
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
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...register('email')} />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">
                {isEdit ? 'New password' : 'Password'}
              </FieldLabel>
              <Input id="password" type="password" {...register('password')} />
              {isEdit && <FieldDescription>Leave blank to keep the current password.</FieldDescription>}
              <FieldError errors={[errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replaceAll('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
