import { create } from "zustand";

interface UserState {
  id: string;
  email: string;
  fullName: string;
  role: "student" | "university" | "admin";
  isActive: boolean;
}

interface AuthStore {
  user: UserState | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setSession: (user: UserState) => void;
  clearSession: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setSession: (user) => set({ user, isAuthenticated: true, isInitialized: true }),
  clearSession: () => set({ user: null, isAuthenticated: false, isInitialized: true }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));
