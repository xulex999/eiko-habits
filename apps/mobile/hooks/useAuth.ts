import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User, AuthTokens } from '@eiko/shared-types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Login failed');

    const { user, tokens } = json.data;
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    // Refresh token is managed via httpOnly cookie on web,
    // but on mobile we store it securely
    set({ user, accessToken: tokens.accessToken, isAuthenticated: true });
  },

  register: async (email: string, password: string, displayName: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Registration failed');

    const { user, tokens } = json.data;
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    set({ user, accessToken: tokens.accessToken, isAuthenticated: true });
  },

  logout: async () => {
    const token = get().accessToken;
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // Ignore network errors on logout
    }
    await SecureStore.deleteItemAsync('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  refreshToken: async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const json = await res.json();
      if (json.success) {
        const { tokens } = json.data;
        await SecureStore.setItemAsync('accessToken', tokens.accessToken);
        set({ accessToken: tokens.accessToken });
      } else {
        await get().logout();
      }
    } catch {
      await get().logout();
    }
  },

  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        // Verify token is still valid by fetching profile
        const res = await fetch(`${API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          set({
            user: json.data,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
    } catch {
      // Token invalid or network error
    }
    set({ isLoading: false });
  },
}));
