const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 1234.5 -> "₹1,234.50" */
export function formatCurrency(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '₹0.00'
  return currencyFormatter.format(amount)
}

/** "Arijul" + "Kader" -> "AK" (falls back to the username, then to "PF"). */
export function getInitials({ firstName, lastName, username } = {}) {
  const first = (firstName || '').trim()
  const last = (lastName || '').trim()

  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
  if (first) return first.slice(0, 2).toUpperCase()

  const handle = (username || '').trim()
  if (handle) return handle.slice(0, 2).toUpperCase()

  return 'PF'
}

/** "Arijul Kader" (falls back to the username, then a neutral label). */
export function getDisplayName(profile) {
  const parts = [profile?.firstName, profile?.lastName].filter((part) => (part || '').trim())
  if (parts.length) return parts.join(' ')
  return (profile?.username || '').trim() || 'PayFlow user'
}

/** 65f1c2...9ab3 -> "••••••••••••••••••••9ab3" — keeps long IDs readable. */
export function maskId(id, visible = 4) {
  const value = String(id || '')
  if (!value) return '—'
  if (value.length <= visible) return value
  return `${'•'.repeat(Math.max(value.length - visible, 4))}${value.slice(-visible)}`
}

/** "8K2M4Q" style reference so users can quote something to support. */
export function generateReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `PF${random.padEnd(6, '0')}`
}

export function formatRelativeTime(isoString) {
  const timestamp = new Date(isoString).getTime()
  if (!Number.isFinite(timestamp)) return ''

  const seconds = Math.round((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Backend user ids are Mongo ObjectIds — 24 hex characters. */
export function isValidUserId(value) {
  return /^[a-fA-F0-9]{24}$/.test(String(value || '').trim())
}
