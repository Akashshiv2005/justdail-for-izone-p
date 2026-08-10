/**
 * Authenticated fetch helper.
 * Wraps the native fetch API to automatically attach the JWT token
 * from localStorage and use relative URLs (proxied by Vite).
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Default to JSON content type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';
  let finalUrl = url;
  if (baseUrl) {
      if (url.startsWith('/api')) {
          if (baseUrl.endsWith('/api')) {
              finalUrl = baseUrl + url.substring(4);
          } else {
              finalUrl = baseUrl + url;
          }
      } else {
          finalUrl = baseUrl + url;
      }
  }

  try {
    const response = await fetch(finalUrl, { ...options, headers });
    return response;
  } catch (error) {
    console.error('Network or Server Error in authFetch:', error);
    return {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ detail: "A server error occurred. Please try again later." }),
      text: async () => "A server error occurred."
    } as Response;
  }
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
