import { format, formatDistanceToNowStrict, isValid, parseISO } from 'date-fns'

export function formatRelative(iso: string | undefined | null): string | null {
  if (!iso) return null
  const date = parseISO(iso)
  if (!isValid(date)) return null
  return formatDistanceToNowStrict(date, { addSuffix: true })
}

export function formatDateTime(iso: string | undefined | null): string | null {
  if (!iso) return null
  const date = parseISO(iso)
  if (!isValid(date)) return null
  return format(date, 'd MMM yyyy, HH:mm')
}

export function initials(name: string | undefined | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

/** Backend may return 0–1 or 0–100. Normalise to an integer percentage. */
export function normaliseScore(score: number | null | undefined): number {
  if (score === null || score === undefined || Number.isNaN(score)) return 0
  const pct = score <= 1 ? score * 100 : score
  return Math.max(0, Math.min(100, Math.round(pct)))
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(value)
}
