'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })
type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  if (done) return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="text-green-600" size={28} />
      </div>
      <h2 className="text-xl font-bold">Password updated</h2>
      <p className="text-muted-foreground text-sm">Your password has been reset successfully.</p>
      <Link href="/login"><Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign in</Button></Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(async () => { await new Promise(r => setTimeout(r, 800)); setDone(true) })} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-muted-foreground text-sm mt-1">Choose a strong password for your account</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" type="password" {...register('confirm')} />
        {errors.confirm && <p className="text-destructive text-xs">{errors.confirm.message}</p>}
      </div>
      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" />Updating...</> : 'Update password'}
      </Button>
    </form>
  )
}
