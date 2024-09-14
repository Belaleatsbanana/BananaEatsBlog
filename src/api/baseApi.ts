import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Add a request interceptor to set the Authorization and Content-Type header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('BananaBlogToken');
    
    // Set Authorization header if the token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Remove the Authorization header if no token
    }

    // Remove Content-Type setting for FormData requests
    if (config.data instanceof FormData) {
      // Let Axios handle 'multipart/form-data' and boundary
      delete config.headers['Content-Type'];
    } else {
      // Set Content-Type to JSON for other request types
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

