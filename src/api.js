import axios from 'axios'
import { getWithExpiry } from './utils/object'

export const API_URL = process.env.REACT_APP_API || 'http://localhost:5000'
export const HOME_URL = process.env.HOME_URL || 'http://localhost:3000/'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = getWithExpiry('@vagas/token')
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear session on Unauthorized
      localStorage.removeItem('@vagas/token')
      localStorage.removeItem('@vagas/user_id')

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=1'
      }
    }
    return Promise.reject(error)
  }
)

export default api
