function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3 || !parts[1]) return null
  try {
    const payload: unknown = JSON.parse(decodeBase64Url(parts[1]))
    if (isRecord(payload) && typeof payload.sub === 'string') return payload.sub
    return null
  } catch {
    return null
  }
}
