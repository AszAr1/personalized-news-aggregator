import axios from 'axios'
import { refreshAccessTokenRequest } from './requests/users/refreshAccessTokenRequest'

const API_URL = 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access-token')

    if (!!access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config


    if (error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/token/')) {
      originalRequest._retry = true

      try {
        const refresh_token = localStorage.getItem('refresh-token')
        if (refresh_token) {
          const data = await refreshAccessTokenRequest({ refresh: refresh_token })
          
          
          api.defaults.headers.Authorization = `Bearer ${data.access_token}`
          localStorage.setItem("access-token", data.access_token)
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access-token')
        localStorage.removeItem('refresh-token')
        // window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)