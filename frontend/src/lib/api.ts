export async function apiClient(endpoint: string, options: RequestInit = {}) {
  // Use VITE_API_URL from .env if available, otherwise fallback to empty string (which uses relative path /api handled by proxy)
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  // If baseUrl ends with '/api' and endpoint starts with '/api', we should remove the duplicate
  let finalUrl = endpoint;
  if (baseUrl) {
      if (endpoint.startsWith('/api')) {
          // If baseUrl already includes /api, we replace it
          if (baseUrl.endsWith('/api')) {
              finalUrl = baseUrl + endpoint.substring(4);
          } else {
              finalUrl = baseUrl + endpoint;
          }
      } else {
          finalUrl = baseUrl + endpoint;
      }
  }

  try {
    const response = await fetch(finalUrl, options);
    if (!response.ok) {
      // Create error object but don't crash the app
      console.error(`API Error: ${response.status} on ${endpoint}`);
    }
    return response;
  } catch (error) {
    console.error('Network or Server Error:', error);
    // Return a mock response that won't crash when .json() is called in the components
    return {
      ok: false,
      status: 500,
      json: async () => ({ message: "A server error occurred. Please try again later." }),
      text: async () => "A server error occurred."
    } as Response;
  }
}
