import { apiClient } from '../lib/api-client'
import { normalizeApiError } from '../lib/api-error'
import type { ApiResponse, PromoValidation } from '../types/api'

export const promoService = {
  async validate(code: string, totalPrice: number): Promise<PromoValidation> {
    try {
      const response = await apiClient.get<ApiResponse<PromoValidation>>(`promo/validate/${encodeURIComponent(code)}`, { params: { total_price: totalPrice } })
      return response.data.data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
