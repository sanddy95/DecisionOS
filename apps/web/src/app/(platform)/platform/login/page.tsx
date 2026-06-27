'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const DEMO_EMAIL = 'admin@decisionos.com'
const DEMO_PASSWORD = 'platform1234'

export default function PlatformLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Email and password are required.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      document.cookie = 'decisionos-platform-auth=1; path=/; max-age=86400'
      toast.success('Welcome, Platform Admin')
      router.push('/platform')
    } else {
      setError('Invalid credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-violet-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">DecisionOS</span>
          </div>
          <p className="text-violet-300 text-sm font-medium">Platform Admin Console</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Platform Sign In</h1>
          <p className="text-sm text-gray-500 mb-6">Super-admin access only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@decisionos.com" autoComplete="email"
                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : 'Sign in to Platform'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 bg-violet-50 rounded-lg p-3 text-xs text-violet-700">
            <p className="font-semibold mb-1">Demo credentials</p>
            <p>Email: <span className="font-mono">admin@decisionos.com</span></p>
            <p>Password: <span className="font-mono">platform1234</span></p>
          </div>
        </div>

        <p className="text-center text-violet-400 text-xs mt-6">
          Looking for the org dashboard? <a href="/login" className="text-violet-200 hover:underline">Sign in here →</a>
        </p>
      </div>
    </div>
  )
}
