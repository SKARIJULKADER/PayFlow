import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from './storage'

/**
 * The backend has no transaction history endpoint yet, so PayFlow keeps a
 * small device-local log of transfers completed in this browser. It is purely
 * presentational — balances always come from GET /account/balance.
 */
const MAX_ENTRIES = 6

export function readActivity() {
  const entries = readJsonStorage(STORAGE_KEYS.activity, [])
  return Array.isArray(entries) ? entries : []
}

export function recordActivity({ amount, to, reference }) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    amount: Number(amount),
    to,
    reference,
    at: new Date().toISOString(),
  }

  const entries = [entry, ...readActivity()].slice(0, MAX_ENTRIES)
  writeJsonStorage(STORAGE_KEYS.activity, entries)
  return entries
}
