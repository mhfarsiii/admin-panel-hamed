/**
 * Admin Panel API Type Definitions - Moramor Core
 * Complete type definitions based on ADMIN_PANEL_API.md
 */

// ============================================
// Base Types & Common Interfaces
// ============================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
}

// ============================================
// Authentication API Types
// ============================================

/**
 * User role enum
 */
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

/**
 * User entity
 */
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Login request
 * POST /auth/login
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Login response
 * POST /auth/login
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

/**
 * Refresh token request
 * POST /auth/refresh
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * Refresh token response
 * POST /auth/refresh
 */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ============================================
// Categories API Types
// ============================================

/**
 * Category entity
 */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  parent?: {
    id: string
    name: string
    slug: string
  }
}

/**
 * Create category request
 * POST /categories
 */
export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive?: boolean
  sortOrder?: number
}

/**
 * Update category request
 * PATCH /categories/:id
 */
export interface UpdateCategoryRequest {
  name?: string
  slug?: string
  description?: string
  image?: string
  parentId?: string
  isActive?: boolean
  sortOrder?: number
}

/**
 * Categories list query parameters
 * GET /categories
 */
export interface CategoriesListQuery {
  includeInactive?: boolean
}

// ============================================
// Products API Types
// ============================================

/**
 * Product dimensions
 */
export interface ProductDimensions {
  length: number
  width: number
  height: number
}

/**
 * Product category (nested in product)
 */
export interface ProductCategory {
  id: string
  name: string
  slug: string
}

/**
 * Product entity
 */
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discount: number
  categoryId: string
  materials: string[]
  images: string[]
  stock: number
  sku?: string
  weight?: number
  dimensions?: ProductDimensions
  isFeatured: boolean
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
  category?: ProductCategory
  averageRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

/**
 * Create product request
 * POST /products
 */
export interface CreateProductRequest {
  name: string
  slug: string
  description?: string
  price: number
  discount?: number
  categoryId: string
  materials?: string[]
  images?: string[]
  stock: number
  sku?: string
  weight?: number
  dimensions?: ProductDimensions
  isFeatured?: boolean
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
}

/**
 * Update product request
 * PATCH /products/:id
 */
export interface UpdateProductRequest {
  name?: string
  slug?: string
  description?: string
  price?: number
  discount?: number
  categoryId?: string
  materials?: string[]
  images?: string[]
  stock?: number
  sku?: string
  weight?: number
  dimensions?: ProductDimensions
  isFeatured?: boolean
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
}

/**
 * Products list query parameters
 * GET /products
 */
export interface ProductsListQuery {
  page?: number
  limit?: number
  q?: string
  category?: string
  min?: number
  max?: number
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'popular'
  featured?: boolean
}

// ============================================
// Orders API Types
// ============================================

/**
 * Order status enum
 */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

/**
 * Payment status enum
 */
export type PaymentStatus =
  | 'UNPAID'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'

/**
 * Payment method enum
 */
export type PaymentMethod = 'ZARINPAL' | 'CASH_ON_DELIVERY'

/**
 * Order item
 */
export interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
  }
  quantity: number
  price: number
}

/**
 * Shipping address
 */
export interface ShippingAddress {
  id: string
  city: string
  province: string
  address: string
  postalCode: string
  receiverName: string
  receiverPhone: string
}

/**
 * Order user
 */
export interface OrderUser {
  id: string
  name: string
  email: string
  phone?: string
}

/**
 * Order entity
 */
export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  user: OrderUser
  items: OrderItem[]
  address: ShippingAddress
  trackingCode?: string
  adminNote?: string
  createdAt: string
  updatedAt: string
}

/**
 * Orders list query parameters
 * GET /orders/admin
 */
export interface OrdersListQuery {
  page?: number
  limit?: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
}

/**
 * Update order status request
 * PATCH /orders/:id/status
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus
  trackingCode?: string
  adminNote?: string
}

// ============================================
// Users API Types
// ============================================

/**
 * User with details (admin view)
 */
export interface UserDetails extends User {
  addresses?: ShippingAddress[]
  orders?: {
    id: string
    orderNumber: string
    status: OrderStatus
    total: number
  }[]
}

/**
 * Users list query parameters
 * GET /users
 */
export interface UsersListQuery {
  page?: number
  limit?: number
}

// ============================================
// Reviews API Types
// ============================================

/**
 * Review entity
 */
export interface Review {
  id: string
  product: {
    id: string
    name: string
    slug: string
  }
  user: {
    id: string
    name: string
    email: string
  }
  rating: number
  comment: string
  approved: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Reviews list query parameters
 * GET /reviews
 */
export interface ReviewsListQuery {
  page?: number
  limit?: number
  approved?: boolean
}

// ============================================
// File Upload API Types
// ============================================

/**
 * Upload image response
 * POST /upload/image
 */
export interface UploadImageResponse {
  url: string
  key: string
  size: number
  mimetype: string
}

/**
 * Upload multiple images response
 * POST /upload/images
 */
export type UploadImagesResponse = UploadImageResponse[]

// ============================================
// Store State Types
// ============================================

/**
 * Base store state with loading and error
 */
export interface BaseStoreState {
  isLoading: boolean
  error: string | null
  success: boolean | null
}

/**
 * Auth store state
 */
export interface AuthState extends BaseStoreState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

/**
 * Products store state
 */
export interface ProductsState extends BaseStoreState {
  products: Product[]
  currentProduct: Product | null
  meta: PaginationMeta | null
}

/**
 * Categories store state
 */
export interface CategoriesState extends BaseStoreState {
  categories: Category[]
  currentCategory: Category | null
}

/**
 * Orders store state
 */
export interface OrdersState extends BaseStoreState {
  orders: Order[]
  currentOrder: Order | null
  meta: PaginationMeta | null
}

/**
 * Users store state
 */
export interface UsersState extends BaseStoreState {
  users: UserDetails[]
  currentUser: UserDetails | null
  meta: PaginationMeta | null
}

/**
 * Reviews store state
 */
export interface ReviewsState extends BaseStoreState {
  reviews: Review[]
  currentReview: Review | null
  meta: PaginationMeta | null
}

// ============================================
// Utility Types
// ============================================

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific properties optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Extract keys from object type
 */
export type KeysOf<T> = keyof T

/**
 * Extract values from object type
 */
export type ValuesOf<T> = T[keyof T]
