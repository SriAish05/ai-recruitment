import { LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { navItems } from '@/lib/navigation'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const logout = useAuthStore((s) => s.logout)

  const run = (action: () => void) => {
    onOpenChange(false)
    action()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.to}
              value={`Go to ${item.label}`}
              onSelect={() => run(() => navigate(item.to))}
            >
              <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem value="Toggle theme" onSelect={() => run(toggleTheme)}>
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            value="Log out"
            onSelect={() =>
              run(() => {
                logout()
                navigate('/login', { replace: true })
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
