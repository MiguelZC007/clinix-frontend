import axios from 'axios';

// Instancia única de Axios
// Prioriza NEXT_PUBLIC_API_URL (disponible en cliente y servidor)
// Si no está definida, verifica NEXT_API_URL (solo servidor)
// Valor por defecto: http://localhost:4000/v1
export const api = axios.create({
  baseURL: process.env.NEXT_API_URL || 'http://localhost:4000/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función helper para obtener token (usada en client.ts)
export async function getAuthToken(): Promise<string | null> {
  // En el cliente, usar getSession de next-auth/react
  if (typeof window !== 'undefined') {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    return session?.accessToken || null;
  }
  // En el servidor, el token se pasa explícitamente o se obtiene de las cookies
  // Por ahora retornamos null, el token se manejará en client.ts
  return null;
}

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Solo manejar errores en el cliente
    if (typeof window !== 'undefined') {
      const { showError } = await import('@/lib/utils/error-handler');
      const { normalizeError } = await import('./errors');
      
      const appError = normalizeError(error);
      
      // Detectar si es una petición de login
      const isAuthRequest = error.config?.url?.includes('/auth/login');
      
      // Mostrar errores de conexión incluso durante el login
      // Para que el usuario sepa que el servidor no está disponible
      if (appError.code === 'NETWORK_ERROR') {
        showError(appError, { logError: true });
      } else if (!isAuthRequest) {
        // Mostrar otros errores solo si no es una petición de login
        showError(appError, { logError: true });
      }
      
      // Si el token expiró o es inválido, redirigir a login
      if (error.response?.status === 401 && !isAuthRequest) {
        // Esperar un momento para que el usuario vea el mensaje
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
    
    return Promise.reject(error);
  }
);
