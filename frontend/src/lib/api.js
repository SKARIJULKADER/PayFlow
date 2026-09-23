/**
 * Thin client for the existing PayFlow Express backend.
 *
 * Endpoints used (never modified, exactly as the backend exposes them):
 *   POST /api/v1/user/signup        { firstName, lastName, username, password }
 *                                   -> { message, token }
 *   GET  /api/v1/account/balance    Authorization: Bearer <token>
 *                                   -> { balance }
 *   POST /api/v1/account/transfer   Authorization: Bearer <token>
 *                                   { to, amount } -> { message }
 *                                   errors: 400 { message }, 403 {} (bad/expired JWT)
 *
 * In development requests go through the Vite proxy (see vite.config.js) so the
 * browser stays same-origin. For a deployed build set VITE_API_URL, e.g.
 *   VITE_API_URL=https://payflow-api.example.com/api/v1
 */

export const API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '')

export const API_ERROR_CODES = {
  network: 'network',
  unauthorized: 'unauthorized',
  server: 'server',
  malformed: 'malformed',
}

export class ApiError extends Error {
  constructor(message, { status = 0, code = API_ERROR_CODES.server } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function isUnauthorized(error) {
  return error instanceof ApiError && error.code === API_ERROR_CODES.unauthorized
}

async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('We could not reach PayFlow. Check your connection and try again.', {
      code: API_ERROR_CODES.network,
    })
  }

  const data = await parseBody(response)

  // The auth middleware answers 403 with an empty body for a missing/expired token.
  if (response.status === 403) {
    throw new ApiError('Your session has expired. Please sign in again.', {
      status: response.status,
      code: API_ERROR_CODES.unauthorized,
    })
  }

  if (!response.ok) {
    throw new ApiError(
      (data && data.message) || 'Something went wrong on our side. Please try again in a moment.',
      { status: response.status, code: API_ERROR_CODES.server },
    )
  }

  if (!data) {
    throw new ApiError('PayFlow returned an unexpected response.', {
      status: response.status,
      code: API_ERROR_CODES.malformed,
    })
  }

  return data
}

export const api = {
  signup({ firstName, lastName, username, password }) {
    return request('/user/signup', {
      method: 'POST',
      body: { firstName, lastName, username, password },
    })
  },

  fetchBalance(token) {
    return request('/account/balance', { token })
  },

  transfer({ token, to, amount }) {
    return request('/account/transfer', {
      method: 'POST',
      token,
      body: { to, amount },
    })
  },
}
