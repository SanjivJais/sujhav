import { removeToken } from "@/lib/token";
import { IUser } from "@/types/user";
import { create } from "zustand";

interface AuthState {
    user: IUser | null;
    setUser: (user: IUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => {
        removeToken();
        set({ user: null});
    },
}));
