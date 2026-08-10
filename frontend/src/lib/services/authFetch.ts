/**
 * Authenticated fetch helper.
 * Wraps the native fetch API to automatically attach the JWT token
 * from localStorage and use relative URLs (proxied by Vite).
 */
import { API_BASE } from './api';

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let finalUrl = url;
  if (finalUrl.startsWith('/api/')) {
    finalUrl = `${API_BASE}/${finalUrl.substring(5)}`;
  }

  return fetch(finalUrl, { ...options, headers });
}

/**
 * Authenticated fetch that parses JSON response.
 */
export async function authFetchJson<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await authFetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed with status ${response.status}`);
  }
  return response.json();
}
