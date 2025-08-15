import { defineStore } from 'pinia'
import axios from 'axios'

export interface Category {
  title: string
  description: string
  image: File | null
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

export const usePanelStore = defineStore('panel', {
  state: () => ({
    isLoading: false,
    categories: [],
    works: [],
    currentCategory: null,
    currentWork: null,
    message: '' as string,
    success:null as boolean | null,
    // currentWorkImages:[],
    // currentWorkExtraImages:[],
    // currentWorkLink:null,
  }),

  actions: {
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
        this.message = (error.response.data.error as string)
        this.success = false
      } finally {
        this.isLoading = false
      }
    },
  },
})
