'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { login, resendOtp, verifyOtp } from '@/services/api/auth.service'
import { ApiError } from '@/lib/api/safe-json'

const credentialsSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type CredentialsValues = z.infer<typeof credentialsSchema>

const otpSchema = z.object({
  code: z.string().length(6, 'Enter the 6-digit code'),
})
type OtpValues = z.infer<typeof otpSchema>

export function LoginForm() {
  const [challengeToken, setChallengeToken] = useState<string | null>(null)

  return challengeToken ? (
    <OtpStep
      challengeToken={challengeToken}
      onBack={() => setChallengeToken(null)}
    />
  ) : (
    <CredentialsStep onChallenge={setChallengeToken} />
  )
}

function CredentialsStep({
  onChallenge,
}: {
  onChallenge: (challengeToken: string) => void
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsValues>({ resolver: zodResolver(credentialsSchema) })

  const onSubmit = async (values: CredentialsValues) => {
    setFormError(null)
    try {
      const { challengeToken } = await login(values.email, values.password)
      onChallenge(challengeToken)
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Unable to sign in',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          <FieldError errors={[errors.password]} />
        </Field>
        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in…' : 'Continue'}
        </Button>
      </FieldGroup>
    </form>
  )
}

const RESEND_COOLDOWN_SECONDS = 60

function OtpStep({
  challengeToken,
  onBack,
}: {
  challengeToken: string
  onBack: () => void
}) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({ resolver: zodResolver(otpSchema) })

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS)
    const interval = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  const onSubmit = async (values: OtpValues) => {
    setFormError(null)
    setNotice(null)
    try {
      const { user, allowed } = await verifyOtp(challengeToken, values.code)
      if (!allowed) {
        setFormError(
          `This account (${user.role}) doesn't have access to the admin dashboard.`,
        )
        return
      }
      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Verification failed')
    }
  }

  const onResend = async () => {
    setFormError(null)
    try {
      await resendOtp(challengeToken)
      setNotice('A new code has been sent.')
      startCooldown()
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Unable to resend code')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.code}>
          <FieldLabel htmlFor="code">Verification code</FieldLabel>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            {...register('code')}
          />
          <FieldDescription>
            Enter the 6-digit code we sent to your email.
          </FieldDescription>
          <FieldError errors={[errors.code]} />
        </Field>
        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Verifying…' : 'Verify and sign in'}
        </Button>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground underline underline-offset-4"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onResend}
            disabled={cooldown > 0}
            className="text-muted-foreground underline underline-offset-4 disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      </FieldGroup>
    </form>
  )
}
