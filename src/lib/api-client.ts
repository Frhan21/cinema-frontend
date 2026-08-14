import axios from 'axios'
import { useAuthStore } from '../stores/auth-store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://cinema-ticketing-api.onrender.com/api/v1/',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined' && !['/login', '/register'].includes(window.location.pathname)) {
        window.location.assign(`/login?reason=session-expired`)
      }
    }
    return Promise.reject(error)
  },
)
