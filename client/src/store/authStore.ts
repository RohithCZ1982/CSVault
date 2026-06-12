import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '../utils/queryClient';

interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  role?: string;
  plan?: string;
  planExpiresAt?: string | null;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        queryClient.clear(); // drop any cached data from a previous session
        set({ user, token });
      },
      logout: () => {
        queryClient.clear();
        set({ user: null, token: null });
      },
      updateUser: (updates) => set(state => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    { name: 'csvault-auth' }
  )
);
