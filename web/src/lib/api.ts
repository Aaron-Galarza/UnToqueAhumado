import { API_URL } from '../config/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

let isHandlingForbidden = false;
const SESSION_EXPIRED_FLAG = 'session_expired';

function handleForbiddenOnce() {
  if (typeof window === 'undefined' || isHandlingForbidden) return;
  isHandlingForbidden = true;

  localStorage.removeItem('token');
  sessionStorage.setItem(SESSION_EXPIRED_FLAG, '1');

  if (window.location.pathname !== '/admin/login') {
    window.location.replace('/admin/login');
    return;
  }

  setTimeout(() => {
    isHandlingForbidden = false;
  }, 1000);
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        handleForbiddenOnce();
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: response.status === 403 ? '' : (errorData.message || `Error del servidor: ${response.status}`),
        status: response.status,
      };
    }

    const responseData = await response.json();
    return {
      ...responseData,
      status: response.status,
    };
  } catch {
    return {
      success: false,
      error: 'Error de conexión. Verificá tu internet o intentá más tarde.',
      status: 0,
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) => fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) => fetchApi<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) => fetchApi<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
};
