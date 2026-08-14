import axios from 'axios'

const token = import.meta.env.VITE_TMDB_READ_TOKEN

if (!token && import.meta.env.DEV) {
  console.warn('VITE_TMDB_READ_TOKEN is not configured. TMDB requests will fail.')
}

export const tmdbClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
})
