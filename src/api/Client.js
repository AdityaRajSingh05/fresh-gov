
// client.js
import axios from 'axios';

/**
 * Axios client configured for your json-server:
 * Base URL: http://localhost:3000/api/v1
 */
export function Client() {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // match your server's API_PREFIX
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}` // uncomment if you add auth
    },
  });

  // Optional: basic logging interceptors
  instance.interceptors.request.use(
    (config) => {
      // console.debug('[API] Request:', config.method?.toUpperCase(), config.url, config.params || config.data);
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // console.error('[API] Error:', error?.response?.status, error?.message);
      return Promise.reject(error);
    }
  );

  return instance;
}
