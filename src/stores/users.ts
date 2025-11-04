/**
 * Users Store - User management
 * Handles user operations for admin panel
 */

import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  UsersState,
  UserDetails,
  UsersListQuery,
  PaginatedResponse,
} from '@/types/types'

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    currentUser: null,
    meta: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Get admin users
     */
    adminUsers: (state): UserDetails[] => {
      return state.users.filter((user) => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
    },

    /**
     * Get regular users
     */
    regularUsers: (state): UserDetails[] => {
      return state.users.filter((user) => user.role === 'USER')
    },

    /**
     * Get verified users
     */
    verifiedUsers: (state): UserDetails[] => {
      return state.users.filter((user) => user.emailVerified)
    },

    /**
     * Get unverified users
     */
    unverifiedUsers: (state): UserDetails[] => {
      return state.users.filter((user) => !user.emailVerified)
    },

    /**
     * Get user by ID
     */
    getUserById: (state) => {
      return (id: string): UserDetails | undefined => {
        return state.users.find((user) => user.id === id)
      }
    },

    /**
     * Get total users count
     */
    totalUsers: (state): number => {
      return state.meta?.total || state.users.length
    },

    /**
     * Get users with orders
     */
    usersWithOrders: (state): UserDetails[] => {
      return state.users.filter((user) => user.orders && user.orders.length > 0)
    },
  },

  actions: {
    /**
     * Fetch all users (admin)
     */
    async fetchUsers(query?: UsersListQuery): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<PaginatedResponse<UserDetails>>('/users', {
          params: query,
        })

        this.users = response.data.data
        this.meta = response.data.meta
      } catch (error: any) {
        console.error('Fetch users error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت کاربران'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single user by ID
     */
    async fetchUserById(id: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<UserDetails>(`/users/${id}`)
        this.currentUser = response.data
      } catch (error: any) {
        console.error('Fetch user error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current user
     */
    clearCurrentUser(): void {
      this.currentUser = null
    },

    /**
     * Clear error message
     */
    clearError(): void {
      this.error = null
    },

    /**
     * Clear success message
     */
    clearSuccess(): void {
      this.success = null
    },
  },
})

