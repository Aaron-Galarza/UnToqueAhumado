import { API_URL } from '../config/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token.replace(/"/g, '')}`; 
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Intentamos leer el mensaje de error que mandó Aaron
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error del servidor: ${response.status}`,
      };
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    // Esto salta si no hay internet o si el backend está apagado
    console.error("Error global de API:", error);
    return {
      success: false,
      error: "Error de conexión. Verificá tu internet o intentá más tarde.",
    };
  }
}

// Exportamos los métodos súper limpios para usar en el resto del proyecto
export const api = {
  get: <T>(endpoint: string) => 
    fetchApi<T>(endpoint, { method: 'GET' }),
    
  post: <T>(endpoint: string, body: any) => 
    fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    
  put: <T>(endpoint: string, body: any) => 
    fetchApi<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    
  patch: <T>(endpoint: string, body: any) => 
    fetchApi<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: <T>(endpoint: string) => 
    fetchApi<T>(endpoint, { method: 'DELETE' }),
};