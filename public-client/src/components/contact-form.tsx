'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send } from 'lucide-react'
import { TurnstileWidget } from './turnstile-widget'
import { submitContactForm } from '@/actions/submit-contact'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Tell us a bit more (10+ characters)'),
})

type ContactValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const [turnstileToken, setTurnstileToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (values: ContactValues) => {
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setStatus('error')
      setStatusMessage('Please complete the verification challenge.')
      return
    }

    const result = await submitContactForm({ ...values, turnstileToken })

    if (result.success) {
      setStatus('success')
      setStatusMessage("Thanks — we'll be in touch shortly.")
      reset()
      setTurnstileToken('')
    } else {
      setStatus('error')
      setStatusMessage(result.error)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" className={inputClass} {...register('name')} />
          {errors.name && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" type="email" className={inputClass} {...register('email')} />
          {errors.email && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone (optional)
          </label>
          <input id="phone" className={inputClass} {...register('phone')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject (optional)
          </label>
          <input id="subject" className={inputClass} {...register('subject')} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea id="message" rows={5} className={inputClass} {...register('message')} />
        {errors.message && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.message.message}</p>
        )}
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      {status !== 'idle' && (
        <p
          role="alert"
          className={
            status === 'success'
              ? 'text-sm text-green-600 dark:text-green-400'
              : 'text-sm text-red-600 dark:text-red-400'
          }
        >
          {statusMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
        <Send className="size-4" />
      </button>
    </form>
  )
}
