/**
 * LocalStorage helpers.
 *
 * Every access is wrapped in try/catch because browsers can throw when
 * storage is disabled (private mode, blocked cookies, full quota).
 */

export function readStorage(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function readJsonStorage(key, fallback = null) {
  const raw = readStorage(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJsonStorage(key, value) {
  return writeStorage(key, JSON.stringify(value))
}

export const STORAGE_KEYS = {
  token: 'payflow.token',
  profile: 'payflow.profile',
  balanceHidden: 'payflow.balanceHidden',
  activity: 'payflow.activity',
}
