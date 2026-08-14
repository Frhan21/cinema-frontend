import { apiClient } from '../lib/api-client'
import { normalizeApiError } from '../lib/api-error'
import type { ApiResponse, PaymentSession, Transaction } from '../types/api'

export const transactionService = {
  async getById(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction>>(`transaction/${id}`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async pay(id: string): Promise<PaymentSession> {
    try {
      const response = await apiClient.post<ApiResponse<PaymentSession>>(`transaction/${id}/pay`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async cancel(id: string): Promise<unknown> {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(`transaction/${id}/cancel`)
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
