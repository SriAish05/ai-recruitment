import { isAxiosError } from 'axios'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function firstString(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c
  }
  return null
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data
    const fromBody = isRecord(data)
      ? firstString(data.message, data.detail, data.error)
      : firstString(data)
    if (fromBody) return fromBody
    const status = error.response?.status
    if (error.code === 'ERR_NETWORK' || status === 502 || status === 503 || status === 504) {
      return 'Cannot reach the backend. Is it running on port 8080?'
    }
    if (status === 404) return 'This endpoint is not available yet.'
    if (status) return `Request failed with status ${status}`
    return error.message || fallback
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
