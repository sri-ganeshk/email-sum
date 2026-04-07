import { create } from "zustand";

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  accessToken: string | null;
  user: GoogleUser | null;
  isAuthenticated: boolean;
  setTokens: (token: string, user: GoogleUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setTokens: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),
  clearAuth: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));
