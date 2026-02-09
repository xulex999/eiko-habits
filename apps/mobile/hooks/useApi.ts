import { useAuth } from './useAuth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

/** Authenticated fetch wrapper */
export function useApi() {
  const { accessToken, refreshToken } = useAuth();

  async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}/api/v1${path}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options?.headers,
      },
    });

    // If 401, try refreshing token
    if (res.status === 401) {
      await refreshToken();
      const newToken = useAuth.getState().accessToken;
      if (newToken) {
        const retryRes = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...options?.headers,
          },
        });
        return retryRes.json();
      }
    }

    return res.json();
  }

  return {
    get: <T>(path: string) => apiFetch<T>(path),
    post: <T>(path: string, body?: unknown) =>
      apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    patch: <T>(path: string, body?: unknown) =>
      apiFetch<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
  };
}
