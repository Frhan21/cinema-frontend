import { apiClient } from '../lib/api-client'
import { normalizeApiError } from '../lib/api-error'
import type { ApiResponse, ApiUser, AuthSession, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types/api'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    try {
      const response = await apiClient.post<ApiResponse<AuthSession>>('auth/login', payload)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async register(payload: RegisterRequest): Promise<AuthSession> {
    try {
      const response = await apiClient.post<ApiResponse<AuthSession>>('auth/register', payload)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getProfile(): Promise<ApiUser> {
    try {
      const response = await apiClient.get<ApiResponse<ApiUser>>('user/profile')
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async updateProfile(payload: UpdateProfileRequest): Promise<ApiUser> {
    try {
      const response = await apiClient.put<ApiResponse<ApiUser>>('user/profile', payload)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
