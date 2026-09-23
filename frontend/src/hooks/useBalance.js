import { useCallback, useEffect, useState } from 'react'
import { ApiError, API_ERROR_CODES, api, isUnauthorized } from '../lib/api'
import { useAuth } from '../context/auth-context'

/**
 * Loads GET /account/balance and keeps the whole app in sync.
 * Never throws: failures are surfaced through `error` so screens can show a
 * friendly inline message (and a retry affordance) instead of crashing.
 */
export function useBalance() {
  const { token, signOut } = useAuth()
  const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!token) return null

      if (silent) setIsRefreshing(true)
      else setIsLoading(true)
      setError(null)

      try {
        const data = await api.fetchBalance(token)
        const value = Number(data && data.balance)

        if (!Number.isFinite(value)) {
          setError(
            new ApiError('We could not read your wallet balance right now.', {
              code: API_ERROR_CODES.malformed,
            }),
          )
          return null
        }

        setBalance(value)
        return value
      } catch (requestError) {
        if (isUnauthorized(requestError)) {
          signOut()
          return null
        }

        setError(
          requestError instanceof ApiError
            ? requestError
            : new ApiError('We could not load your balance. Please try again.', {
                code: API_ERROR_CODES.server,
              }),
        )
        return null
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [token, signOut],
  )

  useEffect(() => {
    load()
  }, [load])

  const refresh = useCallback(() => load({ silent: true }), [load])

  return { balance, isLoading, isRefreshing, error, refresh }
}
