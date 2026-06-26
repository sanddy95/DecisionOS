import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-6xl font-bold text-muted-foreground/30 mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/">Back to Command Center</Link>
        </Button>
      </div>
    </div>
  )
}
