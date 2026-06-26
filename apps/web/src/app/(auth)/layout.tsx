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
