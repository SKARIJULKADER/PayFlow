/**
 * Reads the (already issued) JWT payload.
 *
 * The backend signs { userId } into the token, and there is no /me endpoint,
 * so the client decodes the payload locally to know *who* is signed in.
 * This is never used for authorization decisions — the server always
 * re-verifies the signature in middleware.js.
 */
export function decodeToken(token) {
  if (!token || typeof token !== 'string') return null

  const payload = token.split('.')[1]
  if (!payload) return null

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const binary = window.atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

export function getUserIdFromToken(token) {
  const payload = decodeToken(token)
  return (payload && payload.userId) || null
}
