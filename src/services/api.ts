import { API_CONFIG } from '@/config/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`,
        errorData.details
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

export const api = {
  get: <T>(url: string) => fetchApi<T>(url),
  post: <T>(url: string, data: unknown) =>
    fetchApi<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(url: string, data: unknown) =>
    fetchApi<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(url: string, data: unknown) =>
    fetchApi<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (url: string) =>
    fetchApi<void>(url, {
      method: 'DELETE',
    }),
};
