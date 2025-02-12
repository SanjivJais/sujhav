import { IUser } from '@/types/user'
import { create } from 'zustand'

interface AuthState {
    userProfile: IUser | null
    setUser: (user: IUser) => void
    clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    userProfile: null,
    setUser: (user: IUser) => set({ userProfile: user }),
    clearUser: () => set({ userProfile: null }),
}))