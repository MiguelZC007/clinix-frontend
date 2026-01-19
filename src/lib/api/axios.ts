import axios from 'axios';

// Instancia única de Axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adjuntar token (si existe)
api.interceptors.request.use(
  (config) => {
    // TODO: Integrar con NextAuth o sistema de sesión
    // const token = ...
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta (opcional, el manejo de errores se hace en client.ts o errors.ts)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
