import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : label}
          className={cn('text-muted-foreground hover:text-foreground', className)}
        >
          {copied ? (
            <Check className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{copied ? 'Copied' : label}</TooltipContent>
    </Tooltip>
  )
}
