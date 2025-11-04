/**
 * File Upload Utility
 * Handles image uploads with validation and error handling
 */

import apiClient from '@/api/axios'
import type { UploadImageResponse, UploadImagesResponse } from '@/types/types'

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Allowed image mime types
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]

/**
 * Allowed image extensions
 */
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

/**
 * Error messages
 */
export const UPLOAD_ERROR_MESSAGES = {
  NO_FILE: 'لطفاً یک فایل انتخاب کنید',
  INVALID_TYPE: 'فرمت فایل مجاز نیست. فرمت‌های مجاز: jpg, jpeg, png, gif, webp',
  FILE_TOO_LARGE: 'حجم فایل بیشتر از 5 مگابایت است',
  UPLOAD_FAILED: 'خطا در آپلود فایل. لطفاً دوباره تلاش کنید',
  TOO_MANY_FILES: 'حداکثر 10 فایل می‌توانید آپلود کنید',
}

/**
 * Validate file type
 */
export function validateFileType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type)
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? ALLOWED_IMAGE_EXTENSIONS.includes(extension) : false
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: UPLOAD_ERROR_MESSAGES.NO_FILE }
  }

  if (!validateFileType(file) || !validateFileExtension(file.name)) {
    return { valid: false, error: UPLOAD_ERROR_MESSAGES.INVALID_TYPE }
  }

  if (!validateFileSize(file)) {
    return { valid: false, error: UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE }
  }

  return { valid: true }
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Upload single image
 * @param file - Image file to upload
 * @returns Upload response with URL and metadata
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Create FormData
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiClient.post<UploadImageResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error: any) {
    console.error('Upload image error:', error)
    throw new Error(
      error.response?.data?.message || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED
    )
  }
}

/**
 * Upload multiple images
 * @param files - Array of image files to upload
 * @returns Array of upload responses
 */
export async function uploadImages(files: File[]): Promise<UploadImagesResponse> {
  // Validate number of files
  if (files.length === 0) {
    throw new Error(UPLOAD_ERROR_MESSAGES.NO_FILE)
  }

  if (files.length > 10) {
    throw new Error(UPLOAD_ERROR_MESSAGES.TOO_MANY_FILES)
  }

  // Validate each file
  for (const file of files) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      throw new Error(`${file.name}: ${validation.error}`)
    }
  }

  // Create FormData
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await apiClient.post<UploadImagesResponse>('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error: any) {
    console.error('Upload images error:', error)
    throw new Error(
      error.response?.data?.message || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED
    )
  }
}

/**
 * Upload image with progress tracking
 * @param file - Image file to upload
 * @param onProgress - Progress callback function
 * @returns Upload response with URL and metadata
 */
export async function uploadImageWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadImageResponse> {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Create FormData
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiClient.post<UploadImageResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  } catch (error: any) {
    console.error('Upload image error:', error)
    throw new Error(
      error.response?.data?.message || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED
    )
  }
}

/**
 * Create image preview URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to create image preview'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Revoke image preview URL
 */
export function revokeImagePreview(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Convert image file to Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string)
      } else {
        reject(new Error('Failed to convert file to Base64'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Compress image before upload (optional utility)
 * Note: This is a basic implementation. For production, consider using a library like 'browser-image-compression'
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

