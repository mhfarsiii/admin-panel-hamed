import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  CollectionsState,
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionsListQuery,
} from '@/types/types'

export const useCollectionsStore = defineStore('collections', {
  state: (): CollectionsState => ({
    collections: [],
    currentCollection: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Get active collections only
     */
    activeCollections: (state): Collection[] => {
      return state.collections.filter((collection) => collection.isActive)
    },

    /**
     * Get collection by ID
     */
    getCollectionById: (state) => {
      return (id: string): Collection | undefined => {
        return state.collections.find((collection) => collection.id === id)
      }
    },

    /**
     * Get total collections count
     */
    totalCollections: (state): number => {
      return state.collections.length
    },
  },

  actions: {
    /**
     * Fetch single collection by slug (public endpoint)
     */
    async fetchCollectionBySlug(slug: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Collection>(`/collections/${slug}`)
        this.currentCollection = response.data
      } catch (error: unknown) {
        console.error('Fetch collection by slug error:', error)
        const err = error as { response?: { data?: { message?: string } } }
        this.error = err.response?.data?.message || 'خطا در دریافت کالکشن'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch all collections (admin)
     */
    async fetchCollections(query?: CollectionsListQuery): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Collection[]>('/collections', {
          params: query,
        })

        this.collections = response.data
      } catch (error: unknown) {
        console.error('Fetch collections error:', error)
        const err = error as { response?: { data?: { message?: string } } }
        this.error = err.response?.data?.message || 'خطا در دریافت کالکشن‌ها'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single collection by ID
     */
    async fetchCollectionById(id: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Collection>(`/admin/collections/${id}`)
        this.currentCollection = response.data
      } catch (error: unknown) {
        console.error('Fetch collection error:', error)
        const err = error as { response?: { data?: { message?: string } } }
        this.error = err.response?.data?.message || 'خطا در دریافت کالکشن'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create new collection
     */
    async createCollection(data: CreateCollectionRequest): Promise<Collection | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.post<Collection>('/admin/collections', data)

        // Add to collections list
        this.collections.push(response.data)
        this.success = true

        return response.data
      } catch (error: unknown) {
        console.error('Create collection error:', error)
        const err = error as { response?: { data?: { message?: string } } }
        this.error = err.response?.data?.message || 'خطا در ایجاد کالکشن'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update existing collection
     */
    async updateCollection(id: string, data: UpdateCollectionRequest): Promise<Collection | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.put<Collection>(`/admin/collections/${id}`, data)

        // Update in collections list
        const index = this.collections.findIndex((collection) => collection.id === id)
        if (index !== -1) {
          this.collections[index] = response.data
        }

        // Update current collection if it's the one being updated
        if (this.currentCollection?.id === id) {
          this.currentCollection = response.data
        }

        this.success = true
        return response.data
      } catch (error: unknown) {
        console.error('Update collection error:', error)
        const err = error as { response?: { data?: { message?: string } } }
        this.error = err.response?.data?.message || 'خطا در ویرایش کالکشن'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete collection (soft delete)
     */
    async deleteCollection(id: string): Promise<boolean> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await apiClient.delete(`/admin/collections/${id}`)

        // Remove from collections list
        this.collections = this.collections.filter((collection) => collection.id !== id)

        // Clear current collection if it's the one being deleted
        if (this.currentCollection?.id === id) {
          this.currentCollection = null
        }

        this.success = true
        return true
      } catch (error: unknown) {
        console.error('Delete collection error:', error)
        const err = error as { response?: { data?: { message?: string } } }
        this.error = err.response?.data?.message || 'خطا در حذف کالکشن'
        this.success = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current collection
     */
    clearCurrentCollection(): void {
      this.currentCollection = null
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

