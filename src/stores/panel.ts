import { defineStore } from 'pinia'
import axios from 'axios'
import { removeAuthToken, isAuthenticated } from '@/utils/auth'

export interface Category {
  title: string
  description: string
  image: File | null
}

export interface Work {
  title: string
  description: string
  categoryId: number
  image: File | null
  extraImages: File[]
  link: string
}

interface CategoryResponse {
  id: number
  title: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

interface postDetailsResponse {
  createdAt: string
  description: string
  id: number
  imageUrl: string
  title: string
  updatedAt: string
}

interface PostDataResponse {
  data: postDetailsResponse
  error?: string
  success: boolean
}

interface CategoriesResponse {
  data: CategoryResponse[]
  error?: string
  success: boolean
}

export const usePanelStore = defineStore('panel', {
  state: () => ({
    isLoading: false,
    categories: [] as CategoryResponse[],
    works: [],
    currentCategory: null,
    currentWork: null,
    message: '' as string,
    success: null as boolean | null,
    // currentWorkImages:[],
    // currentWorkExtraImages:[],
    // currentWorkLink:null,
  }),

  getters: {
    isAuthenticated: () => isAuthenticated(),
  },

  actions: {
    logout() {
      removeAuthToken()
    },

    async postCategory(category: Category) {
      this.isLoading = true
      this.success = null
      this.message = ''
      try {
        const response = await axios.post<PostDataResponse>('api/categories', category)
        if (response.data.success) {
          this.success = true
          this.message = 'Category created successfully'
        } else {
          this.success = false
          this.message = 'Category creation failed'
        }
        console.log(response.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.response.data)
        this.message = error.response.data.error as string
        this.success = false
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      this.isLoading = true
      try {
        const response = await axios.get<CategoriesResponse>('api/categories')
        if (response.data.success) {
          this.categories = response.data.data
        } else {
          this.message = 'Failed to fetch categories'
        }
      } catch (error: unknown) {
        console.error('Error fetching categories:', error)
        this.message =
          (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Failed to fetch categories'
      } finally {
        this.isLoading = false
      }
    },

    async postWork(work: Work) {
      this.isLoading = true
      this.success = null
      this.message = ''
      try {
        const formData = new FormData()
        formData.append('title', work.title)
        formData.append('description', work.description)
        formData.append('categoryId', work.categoryId.toString())
        formData.append('link', work.link)

        if (work.image) {
          formData.append('image', work.image)
        }

        if (work.extraImages.length > 0) {
          work.extraImages.forEach((image) => {
            formData.append(`extraImages`, image)
          })
        }

        const response = await axios.post<PostDataResponse>('api/works', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data.success) {
          this.success = true
          this.message = 'Work created successfully'
        } else {
          this.success = false
          this.message = 'Work creation failed'
        }
      } catch (error: unknown) {
        console.error('Error creating work:', error)
        this.message =
          (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Failed to create work'
        this.success = false
      } finally {
        this.isLoading = false
      }
    },
  },
})
