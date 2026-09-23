import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

/** Gate for every wallet screen — bounces guests back to signup. */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
