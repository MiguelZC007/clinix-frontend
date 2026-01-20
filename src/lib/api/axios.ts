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

// Interceptor de respuesta para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el token expiró o es inválido, redirigir a login
    if (error.response?.status === 401) {
      // Solo redirigir en el cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
