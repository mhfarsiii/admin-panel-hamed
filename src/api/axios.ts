/**
 * Axios instance with interceptors
 * Handles authentication, error handling, and request/response transformations
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios'
import type { ErrorResponse } from '@/types/types'

// Base URL from environment variable or default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Request interceptor
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const accessToken = localStorage.getItem('accessToken')

    // Add token to headers if exists
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('❌ [API Request Error]', error)
    }
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handles responses and errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`📥 [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ [API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
      })
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem('refreshToken')

      // If no refresh token, redirect to login
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

        // Save new tokens
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      // You can show a toast or notification here
      console.error('شما اجازه دسترسی به این منبع را ندارید')
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('منبع مورد نظر یافت نشد')
    }

    // Handle 409 Conflict (e.g., duplicate slug)
    if (error.response?.status === 409) {
      console.error('تداخل با داده‌های موجود')
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('خطای سرور. لطفاً بعداً تلاش کنید')
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید')
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید')
    }

    return Promise.reject(error)
  }
)

export default apiClient

