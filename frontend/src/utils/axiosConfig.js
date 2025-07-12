import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000';

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