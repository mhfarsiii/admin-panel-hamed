/**
 * Products Store - Product management
 * Handles CRUD operations for products
 */

import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  ProductsState,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsListQuery,
  PaginatedResponse,
} from '@/types/types'

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    currentProduct: null,
    meta: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Get featured products
     */
    featuredProducts: (state): Product[] => {
      return state.products.filter((product) => product.isFeatured)
    },

    /**
     * Get active products
     */
    activeProducts: (state): Product[] => {
      return state.products.filter((product) => product.isActive)
    },

    /**
     * Get products by category
     */
    getProductsByCategory: (state) => {
      return (categoryId: string): Product[] => {
        return state.products.filter((product) => product.categoryId === categoryId)
      }
    },

    /**
     * Get product by ID
     */
    getProductById: (state) => {
      return (id: string): Product | undefined => {
        return state.products.find((product) => product.id === id)
      }
    },

    /**
     * Get product by slug
     */
    getProductBySlug: (state) => {
      return (slug: string): Product | undefined => {
        return state.products.find((product) => product.slug === slug)
      }
    },

    /**
     * Get total products count
     */
    totalProducts: (state): number => {
      return state.meta?.total || state.products.length
    },

    /**
     * Get out of stock products
     */
    outOfStockProducts: (state): Product[] => {
      return state.products.filter((product) => product.stock === 0)
    },

    /**
     * Get low stock products (stock < 10)
     */
    lowStockProducts: (state): Product[] => {
      return state.products.filter((product) => product.stock > 0 && product.stock < 10)
    },
  },

  actions: {
    /**
     * Fetch all products with filters
     */
    async fetchProducts(query?: ProductsListQuery): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
          params: query,
        })

        this.products = response.data.data
        this.meta = response.data.meta
      } catch (error: any) {
        console.error('Fetch products error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت محصولات'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single product by ID
     */
    async fetchProductById(id: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Product>(`/products/${id}`)
        this.currentProduct = response.data
      } catch (error: any) {
        console.error('Fetch product error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت محصول'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single product by slug
     */
    async fetchProductBySlug(slug: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Product>(`/products/slug/${slug}`)
        this.currentProduct = response.data
      } catch (error: any) {
        console.error('Fetch product error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت محصول'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create new product
     */
    async createProduct(data: CreateProductRequest): Promise<Product | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.post<Product>('/products', data)

        // Add to products list
        this.products.unshift(response.data)
        this.success = true

        return response.data
      } catch (error: any) {
        console.error('Create product error:', error)
        this.error = error.response?.data?.message || 'خطا در ایجاد محصول'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update existing product
     */
    async updateProduct(id: string, data: UpdateProductRequest): Promise<Product | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.patch<Product>(`/products/${id}`, data)

        // Update in products list
        const index = this.products.findIndex((product) => product.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }

        // Update current product if it's the one being updated
        if (this.currentProduct?.id === id) {
          this.currentProduct = response.data
        }

        this.success = true
        return response.data
      } catch (error: any) {
        console.error('Update product error:', error)
        this.error = error.response?.data?.message || 'خطا در ویرایش محصول'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete product
     */
    async deleteProduct(id: string): Promise<boolean> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await apiClient.delete(`/products/${id}`)

        // Remove from products list
        this.products = this.products.filter((product) => product.id !== id)

        // Clear current product if it's the one being deleted
        if (this.currentProduct?.id === id) {
          this.currentProduct = null
        }

        this.success = true
        return true
      } catch (error: any) {
        console.error('Delete product error:', error)
        this.error = error.response?.data?.message || 'خطا در حذف محصول'
        this.success = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current product
     */
    clearCurrentProduct(): void {
      this.currentProduct = null
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

