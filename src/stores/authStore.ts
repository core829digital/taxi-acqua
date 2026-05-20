import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole } from '@/types'
import { mockUsers } from '@/data/mock'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  loginAs: (role: UserRole) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, _password: string) => {
        const user = mockUsers.find((u) => u.email === email)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      loginAs: (role: UserRole) => {
        const user = mockUsers.find((u) => u.role === role)
        if (user) {
          set({ user, isAuthenticated: true })
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },
    }),
    {
      name: 'taxi-acqua-auth',
    }
  )
)
