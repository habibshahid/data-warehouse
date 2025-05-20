// src/api/index.js
import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:3900',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token, '888888888888888888')
    if (token) {
      config.headers.Authorization = `${ token }`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;