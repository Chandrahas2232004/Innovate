import axios from 'axios';

// Set base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

// Set default headers for all requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log('Axios Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Axios Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axios; 