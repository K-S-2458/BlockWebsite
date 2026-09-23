import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid infinite loop if already on /login or checking current session /api/auth/me
      const requestUrl = error.config?.url || '';
      const isAuthCheck = requestUrl.includes('/auth/me');
      const isLoginOrRegister =
        requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (!isAuthCheck && !isLoginOrRegister) {
        localStorage.removeItem('auth_token');
        if (window.location.pathname !== '/login') {
          window.location.href = `/login?redirect=${encodeURIComponent(
            window.location.pathname
          )}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
