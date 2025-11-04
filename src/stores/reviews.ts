/**
 * Reviews Store - Review management
 * Handles review operations for admin panel
 */

import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  ReviewsState,
  Review,
  ReviewsListQuery,
  PaginatedResponse,
} from '@/types/types'

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    currentReview: null,
    meta: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Get approved reviews
     */
    approvedReviews: (state): Review[] => {
      return state.reviews.filter((review) => review.approved)
    },

    /**
     * Get pending reviews (not approved)
     */
    pendingReviews: (state): Review[] => {
      return state.reviews.filter((review) => !review.approved)
    },

    /**
     * Get reviews by product ID
     */
    getReviewsByProduct: (state) => {
      return (productId: string): Review[] => {
        return state.reviews.filter((review) => review.product.id === productId)
      }
    },

    /**
     * Get review by ID
     */
    getReviewById: (state) => {
      return (id: string): Review | undefined => {
        return state.reviews.find((review) => review.id === id)
      }
    },

    /**
     * Get total reviews count
     */
    totalReviews: (state): number => {
      return state.meta?.total || state.reviews.length
    },

    /**
     * Get pending reviews count
     */
    pendingReviewsCount: (state): number => {
      return state.reviews.filter((review) => !review.approved).length
    },

    /**
     * Get average rating
     */
    averageRating: (state): number => {
      if (state.reviews.length === 0) return 0
      const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0)
      return sum / state.reviews.length
    },
  },

  actions: {
    /**
     * Fetch all reviews (admin)
     */
    async fetchReviews(query?: ReviewsListQuery): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<PaginatedResponse<Review>>('/reviews', {
          params: query,
        })

        this.reviews = response.data.data
        this.meta = response.data.meta
      } catch (error: any) {
        console.error('Fetch reviews error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت نظرات'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single review by ID
     */
    async fetchReviewById(id: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Review>(`/reviews/${id}`)
        this.currentReview = response.data
      } catch (error: any) {
        console.error('Fetch review error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت نظر'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Approve review
     */
    async approveReview(id: string): Promise<Review | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.patch<Review>(`/reviews/${id}/approve`)

        // Update in reviews list
        const index = this.reviews.findIndex((review) => review.id === id)
        if (index !== -1) {
          this.reviews[index] = response.data
        }

        // Update current review if it's the one being approved
        if (this.currentReview?.id === id) {
          this.currentReview = response.data
        }

        this.success = true
        return response.data
      } catch (error: any) {
        console.error('Approve review error:', error)
        this.error = error.response?.data?.message || 'خطا در تایید نظر'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete review
     */
    async deleteReview(id: string): Promise<boolean> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await apiClient.delete(`/reviews/${id}`)

        // Remove from reviews list
        this.reviews = this.reviews.filter((review) => review.id !== id)

        // Clear current review if it's the one being deleted
        if (this.currentReview?.id === id) {
          this.currentReview = null
        }

        this.success = true
        return true
      } catch (error: any) {
        console.error('Delete review error:', error)
        this.error = error.response?.data?.message || 'خطا در حذف نظر'
        this.success = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current review
     */
    clearCurrentReview(): void {
      this.currentReview = null
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

