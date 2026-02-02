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
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No intentar refresh si ya estamos en la ruta de refresh o si ya reintentamos
    if (error.response?.status === 401 && (
      originalRequest.url === `${API_URL}/auth/refresh` ||
      originalRequest.url === '/auth/refresh' ||
      originalRequest._retry
    )) {
      isRefreshing = false;
      processQueue(error, null);
      // Limpiar localStorage y redirigir
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Solo redirigir si no estamos ya en login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }

    // Si el token expiró, intentar refrescar automáticamente
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya hay un refresh en progreso, poner en cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // El refresh token se envía automáticamente via cookie
        await api.post(`${API_URL}/auth/refresh`, {});
        isRefreshing = false;
        processQueue(null, 'refreshed');
        
        // Reintentar la petición original (nueva cookie se envía automáticamente)
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        // Si falla el refresh, redirigir a login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Solo redirigir si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
