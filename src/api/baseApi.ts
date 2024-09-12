import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Add a request interceptor to set the Authorization and Content-Type header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('BananaBlogToken')

    // Set Authorization header if the token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization // Remove the Authorization header if no token
    }

    // Check if the request is for file upload
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      // Reset or explicitly set to JSON for all other cases
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
