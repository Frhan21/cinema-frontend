import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ApiUser, AuthSession } from '../types/api'

interface AuthState {
  user: ApiUser | null
  token: string | null
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  updateUser: (user: ApiUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: ({ token, ...user }) => {
        localStorage.setItem('access_token', token)
        set({ token, user, isAuthenticated: true })
      },
      updateUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('access_token')
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    { name: 'cinereserve-auth' },
  ),
)
