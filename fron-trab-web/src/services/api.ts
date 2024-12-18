import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

// Define an interface for the custom configuration
interface ApiConfig extends AxiosRequestConfig {
  credentials?: string
}

// Create the API instance with TypeScript typing
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Typed request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

// Typed response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default api
