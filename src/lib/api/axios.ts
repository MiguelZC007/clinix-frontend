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

// Contador de peticiones activas para manejar múltiples peticiones simultáneas
let activeRequests = 0;
let storeInstance: any = null;

// Función para obtener o crear la instancia del store de Jotai
async function getStore() {
  if (typeof window === 'undefined') return null;
  
  if (!storeInstance) {
    const { getDefaultStore } = await import('jotai');
    storeInstance = getDefaultStore();
  }
  
  return storeInstance;
}

// Función para actualizar el estado de loading
async function updateApiLoading(isLoading: boolean) {
  if (typeof window === 'undefined') return;
  
  const store = await getStore();
  if (!store) return;
  
  const { apiLoadingAtom } = await import('@/lib/store/loading.atoms');
  
  if (isLoading) {
    activeRequests++;
    store.set(apiLoadingAtom, true);
  } else {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
      store.set(apiLoadingAtom, false);
    }
  }
}

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

// Interceptor de request para activar loading
api.interceptors.request.use(
  async (config) => {
    // Solo activar loading en el cliente y excluir peticiones de login
    if (typeof window !== 'undefined' && !config.url?.includes('/auth/login')) {
      await updateApiLoading(true);
    }
    return config;
  },
  async (error) => {
    // Si hay error en el request, desactivar loading
    if (typeof window !== 'undefined' && !error.config?.url?.includes('/auth/login')) {
      await updateApiLoading(false);
    }
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores y desactivar loading
api.interceptors.response.use(
  async (response) => {
    // Desactivar loading cuando la petición termina exitosamente
    if (typeof window !== 'undefined' && !response.config.url?.includes('/auth/login')) {
      await updateApiLoading(false);
    }
    return response;
  },
  async (error) => {
    // Detectar si es una petición de login (antes de cualquier otra lógica)
    const isAuthRequest = error.config?.url?.includes('/auth/login');
    
    // Solo manejar errores en el cliente
    if (typeof window !== 'undefined') {
      const { showError } = await import('@/lib/utils/error-handler');
      const { normalizeError } = await import('./errors');
      
      const appError = normalizeError(error);
      
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
          // Obtener el locale actual de la URL o usar 'es' por defecto
          const currentPath = window.location.pathname;
          const localeMatch = currentPath.match(/^\/(es|en)/);
          const locale = localeMatch ? localeMatch[1] : 'es';
          const loginPath = locale === 'es' ? '/login' : `/${locale}/login`;
          window.location.href = loginPath;
        }, 2000);
      }
    }
    
    // Desactivar loading cuando hay error (excepto login)
    if (typeof window !== 'undefined' && !isAuthRequest) {
      await updateApiLoading(false);
    }
    
    return Promise.reject(error);
  }
);
