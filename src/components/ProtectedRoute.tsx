import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import type { UserRole } from '../types/api'

export function ProtectedRoute({ children, role }: PropsWithChildren<{ role?: UserRole }>) {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }
  return children
}
