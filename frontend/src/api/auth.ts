import api from '@/lib/axios'
import type { AuthResponse, LoginRequest } from '@/types'

export const authApi = {
  async login(body: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', body)
    return data
  },

  async register(body: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', body)
    return data
  },
}
