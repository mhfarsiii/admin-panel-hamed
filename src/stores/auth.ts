/**
 * Auth Store - Authentication and user management
 * Handles login, logout, token refresh, and user state
 */

import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  AuthState,
  LoginRequest,
  LoginResponse,
  User,
} from '@/types/types'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Check if user is authenticated
     */
    isAuthenticated: (state): boolean => {
      return !!state.accessToken && !!state.user
    },

    /**
     * Check if user is admin
     */
    isAdmin: (state): boolean => {
      return state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN'
    },

    /**
     * Get user role
     */
    userRole: (state): string | null => {
      return state.user?.role || null
    },

    /**
     * Get user name
     */
    userName: (state): string => {
      return state.user?.name || 'کاربر'
    },

    /**
     * Get user email
     */
    userEmail: (state): string => {
      return state.user?.email || ''
    },
  },

  actions: {
    /**
     * Login user
     */
    async login(credentials: LoginRequest): Promise<void> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
        const { accessToken, refreshToken, user } = response.data

        // Save tokens to localStorage
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        // Update state
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.user = user
        this.success = true

        // Check if user is admin
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          throw new Error('شما اجازه دسترسی به پنل ادمین را ندارید')
        }
      } catch (error: any) {
        console.error('Login error:', error)
        this.error = error.response?.data?.message || 'ورود ناموفق بود. لطفاً دوباره تلاش کنید'
        this.success = false

        // Clear tokens on error
        this.clearAuth()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout user
     */
    logout(): void {
      this.clearAuth()

      // Navigate to login page
      const router = useRouter()
      router.push('/login')
    },

    /**
     * Clear authentication data
     */
    clearAuth(): void {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.error = null
      this.success = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },

    /**
     * Fetch current user information
     */
    async fetchCurrentUser(): Promise<void> {
      if (!this.accessToken) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<User>('/auth/me')
        this.user = response.data

        // Check if user is admin
        if (this.user.role !== 'ADMIN' && this.user.role !== 'SUPER_ADMIN') {
          throw new Error('شما اجازه دسترسی به پنل ادمین را ندارید')
        }
      } catch (error: any) {
        console.error('Fetch user error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'

        // If unauthorized, clear auth
        if (error.response?.status === 401) {
          this.clearAuth()
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Refresh access token
     */
    async refreshAccessToken(): Promise<void> {
      if (!this.refreshToken) {
        this.clearAuth()
        return
      }

      try {
        const response = await apiClient.post('/auth/refresh', {
          refreshToken: this.refreshToken,
        })

        const { accessToken, refreshToken } = response.data

        // Update tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        this.accessToken = accessToken
        this.refreshToken = refreshToken
      } catch (error: any) {
        console.error('Token refresh error:', error)
        this.clearAuth()
        throw error
      }
    },

    /**
     * Initialize auth state on app load
     */
    async initializeAuth(): Promise<void> {
      if (this.accessToken) {
        await this.fetchCurrentUser()
      }
    },
  },
})

