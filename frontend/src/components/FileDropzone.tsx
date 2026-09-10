import { FileText, Upload, X } from 'lucide-react'
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import { Button } from '@/components/ui/button'
import { formatBytes } from '@/lib/format'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  file: File | null
  onChange: (file: File | null) => void
  maxSizeBytes?: number
  error?: string
  disabled?: boolean
  id?: string
}

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024

function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export function FileDropzone({
  file,
  onChange,
  maxSizeBytes = DEFAULT_MAX_BYTES,
  error,
  disabled = false,
  id,
}: FileDropzoneProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const message = localError ?? error

  const accept = (candidate: File | undefined) => {
    if (!candidate) return
    if (!isPdf(candidate)) {
      setLocalError('Only PDF files are supported')
      return
    }
    if (candidate.size > maxSizeBytes) {
      setLocalError(`File is larger than ${formatBytes(maxSizeBytes)}`)
      return
    }
    setLocalError(null)
    onChange(candidate)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    accept(e.target.files?.[0])
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    accept(e.dataTransfer.files?.[0])
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleRemove = () => {
    setLocalError(null)
    onChange(null)
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled}
        tabIndex={-1}
      />

      {file ? (
        <div className="flex items-center gap-3 rounded-md border bg-card p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
            <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground tabular-nums">{formatBytes(file.size)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            disabled={disabled}
            aria-label="Remove file"
            className="text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          disabled={disabled}
          aria-describedby={message ? `${inputId}-error` : undefined}
          aria-invalid={message ? true : undefined}
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-md border border-dashed px-4 py-8 text-center transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isDragging ? 'border-foreground/40 bg-accent' : 'hover:border-foreground/30 hover:bg-accent/50',
            message && 'border-destructive/60'
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-card text-muted-foreground">
            <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-medium">Drop PDF here or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF only, up to {formatBytes(maxSizeBytes)}</p>
        </button>
      )}

      {message && (
        <p id={`${inputId}-error`} className="mt-2 text-xs text-destructive">
          {message}
        </p>
      )}
    </div>
  )
}
