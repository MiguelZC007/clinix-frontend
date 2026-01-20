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
