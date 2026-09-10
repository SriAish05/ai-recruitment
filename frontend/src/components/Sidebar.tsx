import { ChevronsUpDown, LogOut, Search } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initials } from '@/lib/format'
import { getUsernameFromToken } from '@/lib/jwt'
import { navItems } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

interface SidebarProps {
  onNavigate?: () => void
  onOpenCommandPalette: () => void
}

export function Sidebar({ onNavigate, onOpenCommandPalette }: SidebarProps) {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const username = getUsernameFromToken(token) ?? 'HR user'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-5">
        <Logo />
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className={cn(
            'flex h-9 w-full items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
            focusRing
          )}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5 px-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors lg:h-9',
                focusRing,
                isActive
                  ? 'bg-neutral-100 text-foreground dark:bg-neutral-900'
                  : 'text-muted-foreground hover:bg-neutral-100/70 hover:text-foreground dark:hover:bg-neutral-900/70'
              )
            }
          >
            <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex h-11 min-w-0 flex-1 items-center gap-3 rounded-md px-2 text-left transition-colors hover:bg-accent',
                  focusRing
                )}
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {initials(username)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{username}</p>
                  <p className="text-xs text-muted-foreground">HR</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{username}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
