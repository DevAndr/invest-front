import {create, useStore} from "zustand";
import { persist } from "zustand/middleware";
import {AuthUser} from "@/app/api/auth/types";

interface UserStore {
    user: AuthUser | null;
    token: string | null;

    setUser: (user: AuthUser) => void;
    setToken: (token: string) => void;
    setAuth: (user: AuthUser, token: string) => void;
    clear: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,

            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            setAuth: (user, token) => set({ user, token }),
            clear: () => set({ user: null, token: null }),
        }),
        {
            name: "user-storage", // ключ в localStorage
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);

export const useUser  = () => useUserStore(s => s.user);
export const useUserId  = () => useUserStore(s => s.user?.id);
export const useToken = () => useUserStore(s => s.token);
export const useIsAuth = () => useUserStore(s => !!s.token);
export const useUserState = () => useStore(useUserStore, s => s)