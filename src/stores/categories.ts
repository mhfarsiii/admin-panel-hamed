/**
 * Categories Store - Category management
 * Handles CRUD operations for categories
 */

import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  CategoriesState,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoriesListQuery,
} from '@/types/types'

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    currentCategory: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Get active categories only
     */
    activeCategories: (state): Category[] => {
      return state.categories.filter((cat) => cat.isActive)
    },

    /**
     * Get parent categories (no parentId)
     */
    parentCategories: (state): Category[] => {
      return state.categories.filter((cat) => !cat.parentId)
    },

    /**
     * Get subcategories of a parent
     */
    getSubcategories: (state) => {
      return (parentId: string): Category[] => {
        return state.categories.filter((cat) => cat.parentId === parentId)
      }
    },

    /**
     * Get category by ID
     */
    getCategoryById: (state) => {
      return (id: string): Category | undefined => {
        return state.categories.find((cat) => cat.id === id)
      }
    },

    /**
     * Get category by slug
     */
    getCategoryBySlug: (state) => {
      return (slug: string): Category | undefined => {
        return state.categories.find((cat) => cat.slug === slug)
      }
    },

    /**
     * Get total categories count
     */
    totalCategories: (state): number => {
      return state.categories.length
    },
  },

  actions: {
    /**
     * Fetch all categories
     */
    async fetchCategories(query?: CategoriesListQuery): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Category[]>('/categories', {
          params: query,
        })

        this.categories = response.data
      } catch (error: any) {
        console.error('Fetch categories error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت دسته‌بندی‌ها'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single category by ID
     */
    async fetchCategoryById(id: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Category>(`/categories/${id}`)
        this.currentCategory = response.data
      } catch (error: any) {
        console.error('Fetch category error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت دسته‌بندی'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create new category
     */
    async createCategory(data: CreateCategoryRequest): Promise<Category | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.post<Category>('/categories', data)

        // Add to categories list
        this.categories.push(response.data)
        this.success = true

        return response.data
      } catch (error: any) {
        console.error('Create category error:', error)
        this.error = error.response?.data?.message || 'خطا در ایجاد دسته‌بندی'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update existing category
     */
    async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.patch<Category>(`/categories/${id}`, data)

        // Update in categories list
        const index = this.categories.findIndex((cat) => cat.id === id)
        if (index !== -1) {
          this.categories[index] = response.data
        }

        // Update current category if it's the one being updated
        if (this.currentCategory?.id === id) {
          this.currentCategory = response.data
        }

        this.success = true
        return response.data
      } catch (error: any) {
        console.error('Update category error:', error)
        this.error = error.response?.data?.message || 'خطا در ویرایش دسته‌بندی'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete category
     */
    async deleteCategory(id: string): Promise<boolean> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await apiClient.delete(`/categories/${id}`)

        // Remove from categories list
        this.categories = this.categories.filter((cat) => cat.id !== id)

        // Clear current category if it's the one being deleted
        if (this.currentCategory?.id === id) {
          this.currentCategory = null
        }

        this.success = true
        return true
      } catch (error: any) {
        console.error('Delete category error:', error)
        this.error = error.response?.data?.message || 'خطا در حذف دسته‌بندی'
        this.success = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current category
     */
    clearCurrentCategory(): void {
      this.currentCategory = null
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

