import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error message shape
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    
    if (error.response?.status === 401) {
      // We will handle redirect logic in the UI or Context layer
      window.dispatchEvent(new Event('auth-unauthorized'));
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
