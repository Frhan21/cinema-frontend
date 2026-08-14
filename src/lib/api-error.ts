import axios from 'axios'
import type { ApiErrorResponse } from '../types/api'

export class ApiClientError extends Error {
  readonly status?: number
  readonly detail?: string

  constructor(
    message: string,
    status?: number,
    detail?: string,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.detail = detail
  }
}

export function normalizeApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data
    return new ApiClientError(
      data?.message || 'The server could not complete the request.',
      error.response?.status,
      data?.error,
    )
  }
  return new ApiClientError(error instanceof Error ? error.message : 'An unexpected error occurred.')
}
