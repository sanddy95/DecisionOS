# Phase 3: Authentication Pages

**Goal:** Build login, forgot-password, and reset-password pages with enterprise branding, real-time validation, and auth store integration.

---

## Files Created

- `apps/web/src/app/(auth)/layout.tsx`
- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(auth)/forgot-password/page.tsx`
- `apps/web/src/app/(auth)/reset-password/page.tsx`
- `apps/web/src/components/auth/login-form.tsx`
- `apps/web/src/components/auth/forgot-password-form.tsx`

---

## Task 1: Auth Layout

- [ ] **Step 1: Create auth layout**

`apps/web/src/app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">DecisionOS</span>
          </div>
          <p className="text-navy-200 text-sm">AI-Powered Decision Intelligence</p>
        </div>
        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-white/10 p-8">
          {children}
        </div>
        <p className="text-center text-navy-300 text-xs mt-6">
          © 2026 DecisionOS · Enterprise Decision Intelligence Platform
        </p>
      </div>
    </div>
  )
}
```

---

## Task 2: Login Page

- [ ] **Step 1: Create login form component**

`apps/web/src/components/auth/login-form.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/auth.store'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    const ok = await login(values.email, values.password)
    if (ok) {
      toast.success('Welcome back!')
      router.push('/')
    } else {
      toast.error('Invalid credentials. Try alex@acmedemo.com')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="text-muted-foreground text-sm mt-1">Access your decision intelligence platform</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email" type="email" placeholder="you@company.com"
          autoComplete="email" {...register('email')}
          className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password" type={showPassword ? 'text' : 'password'}
            placeholder="••••••••" autoComplete="current-password"
            {...register('password')} className="pr-10"
          />
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" />Signing in...</> : 'Sign in'}
      </Button>

      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Demo credentials</p>
        <p>Email: <span className="font-mono">alex@acmedemo.com</span></p>
        <p>Password: <span className="font-mono">any password</span></p>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Create login page**

`apps/web/src/app/(auth)/login/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return <LoginForm />
}
```

---

## Task 3: Forgot Password Page

- [ ] **Step 1: Create forgot password form**

`apps/web/src/components/auth/forgot-password-form.tsx`:
```tsx
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
```

- [ ] **Step 2: Create forgot password page**

`apps/web/src/app/(auth)/forgot-password/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
export const metadata: Metadata = { title: 'Reset Password' }
export default function ForgotPasswordPage() { return <ForgotPasswordForm /> }
```

- [ ] **Step 3: Create reset password page**

`apps/web/src/app/(auth)/reset-password/page.tsx`:
```tsx
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
```

- [ ] **Step 4: Create middleware for auth redirect**

`apps/web/src/middleware.ts`:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some(p => pathname.startsWith(p))
  const authCookie = request.cookies.get('decisionos-auth')

  if (!isPublic && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (isPublic && authCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/\(auth\) apps/web/src/components/auth apps/web/src/middleware.ts
git commit -m "feat: add auth pages — login, forgot-password, reset-password"
```
