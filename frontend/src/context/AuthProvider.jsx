import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { AuthContext } from './auth-context'
import {
  STORAGE_KEYS,
  readJsonStorage,
  readStorage,
  removeStorage,
  writeJsonStorage,
  writeStorage,
} from '../lib/storage'
import { getUserIdFromToken } from '../lib/token'

/**
 * Holds the JWT issued by POST /user/signup plus the profile the user typed in.
 * There is no /me endpoint on the backend, so the profile is cached locally and
 * the user id is read out of the token payload.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStorage(STORAGE_KEYS.token))
  const [profile, setProfile] = useState(() => readJsonStorage(STORAGE_KEYS.profile))

  const signIn = useCallback((nextToken, nextProfile) => {
    const enrichedProfile = {
      ...(nextProfile || {}),
      userId: getUserIdFromToken(nextToken) || (nextProfile && nextProfile.userId) || null,
    }

    writeStorage(STORAGE_KEYS.token, nextToken)
    writeJsonStorage(STORAGE_KEYS.profile, enrichedProfile)
    setToken(nextToken)
    setProfile(enrichedProfile)

    return enrichedProfile
  }, [])

  const signOut = useCallback(() => {
    removeStorage(STORAGE_KEYS.token)
    removeStorage(STORAGE_KEYS.profile)
    setToken(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      profile,
      userId: (profile && profile.userId) || null,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [token, profile, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}
