'use client'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { User, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'

export function UserMenu() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-navy-900 text-white text-xs">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.role}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="w-fit text-xs mt-1">{user.role}</Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User size={14} className="mr-2" /> Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={14} className="mr-2" /> : <Moon size={14} className="mr-2" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => { logout(); router.push('/login') }}>
          <LogOut size={14} className="mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
