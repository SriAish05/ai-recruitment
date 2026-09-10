import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useThemeStore } from '@/store/themeStore'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label={label}
          className={className}
        >
          {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}
