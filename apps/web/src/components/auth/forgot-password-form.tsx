'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({ email: z.string().email('Please enter a valid email address') })
type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit() {
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="text-green-600" size={28} />
        </div>
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          We sent a password reset link to <strong>{getValues('email')}</strong>
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full mt-2">
            <ArrowLeft size={16} className="mr-2" /> Back to sign in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-muted-foreground text-sm mt-1">Enter your email and we'll send a reset link</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" placeholder="you@company.com" {...register('email')}
          className={errors.email ? 'border-destructive' : ''} />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" />Sending...</> : 'Send reset link'}
      </Button>
      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </form>
  )
}
