import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enviar cookies automáticamente
});

// Interceptor para agregar token de autenticación (fallback para compatibilidad) (fallback para compatibilidad)
api.interceptors.request.use(
  (config) => {
    // Las cookies se envían automáticamente con withCredentials: true
    // Este interceptor se mantiene solo para compatibilidad con APIs externas
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró, intentar refrescar automáticamente
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // El refresh token se envía automáticamente via cookie
        await api.post(`${API_URL}/auth/refresh`, {});
        
        // Reintentar la petición original (nueva cookie se envía automáticamente)
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, redirigir a login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
