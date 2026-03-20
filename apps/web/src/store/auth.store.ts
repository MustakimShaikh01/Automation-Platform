import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const { accessToken, user } = await authApi.login(email, password);
        localStorage.setItem('autoify_token', accessToken);
        set({ user, token: accessToken, isLoading: false });
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        const { accessToken, user } = await authApi.register(name, email, password);
        localStorage.setItem('autoify_token', accessToken);
        set({ user, token: accessToken, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem('autoify_token');
        set({ user: null, token: null });
        window.location.href = '/auth/login';
      },

      loadUser: async () => {
        const token = localStorage.getItem('autoify_token');
        if (!token) return;
        try {
          const user = await authApi.me();
          set({ user, token });
        } catch {
          localStorage.removeItem('autoify_token');
          set({ user: null, token: null });
        }
      },
    }),
    { name: 'autoify-auth', partialize: (state) => ({ token: state.token }) },
  ),
);
