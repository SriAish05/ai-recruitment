import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: localStorage.getItem('recruit_token'),
  isAuthenticated: !!localStorage.getItem('recruit_token'),
  setToken: (token) => {
    localStorage.setItem('recruit_token', token)
    set({ token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('recruit_token')
    set({ token: null, isAuthenticated: false })
  },
}))
