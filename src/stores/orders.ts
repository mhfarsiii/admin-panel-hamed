/**
 * Orders Store - Order management
 * Handles order operations for admin panel
 */

import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import type {
  OrdersState,
  Order,
  OrdersListQuery,
  UpdateOrderStatusRequest,
  PaginatedResponse,
  OrderStatus,
} from '@/types/types'

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    currentOrder: null,
    meta: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    /**
     * Get pending orders
     */
    pendingOrders: (state): Order[] => {
      return state.orders.filter((order) => order.status === 'PENDING')
    },

    /**
     * Get confirmed orders
     */
    confirmedOrders: (state): Order[] => {
      return state.orders.filter((order) => order.status === 'CONFIRMED')
    },

    /**
     * Get shipped orders
     */
    shippedOrders: (state): Order[] => {
      return state.orders.filter((order) => order.status === 'SHIPPED')
    },

    /**
     * Get delivered orders
     */
    deliveredOrders: (state): Order[] => {
      return state.orders.filter((order) => order.status === 'DELIVERED')
    },

    /**
     * Get cancelled orders
     */
    cancelledOrders: (state): Order[] => {
      return state.orders.filter((order) => order.status === 'CANCELLED')
    },

    /**
     * Get orders by status
     */
    getOrdersByStatus: (state) => {
      return (status: OrderStatus): Order[] => {
        return state.orders.filter((order) => order.status === status)
      }
    },

    /**
     * Get order by ID
     */
    getOrderById: (state) => {
      return (id: string): Order | undefined => {
        return state.orders.find((order) => order.id === id)
      }
    },

    /**
     * Get total orders count
     */
    totalOrders: (state): number => {
      return state.meta?.total || state.orders.length
    },

    /**
     * Get total revenue from paid orders
     */
    totalRevenue: (state): number => {
      return state.orders
        .filter((order) => order.paymentStatus === 'PAID')
        .reduce((sum, order) => sum + order.total, 0)
    },

    /**
     * Get pending orders count
     */
    pendingOrdersCount: (state): number => {
      return state.orders.filter((order) => order.status === 'PENDING').length
    },
  },

  actions: {
    /**
     * Fetch all orders (admin)
     */
    async fetchOrders(query?: OrdersListQuery): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<PaginatedResponse<Order>>('/orders/admin', {
          params: query,
        })

        this.orders = response.data.data
        this.meta = response.data.meta
      } catch (error: any) {
        console.error('Fetch orders error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت سفارشات'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch single order by ID
     */
    async fetchOrderById(id: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get<Order>(`/orders/${id}`)
        this.currentOrder = response.data
      } catch (error: any) {
        console.error('Fetch order error:', error)
        this.error = error.response?.data?.message || 'خطا در دریافت سفارش'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update order status
     */
    async updateOrderStatus(
      id: string,
      data: UpdateOrderStatusRequest
    ): Promise<Order | null> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await apiClient.patch<Order>(`/orders/${id}/status`, data)

        // Update in orders list
        const index = this.orders.findIndex((order) => order.id === id)
        if (index !== -1) {
          this.orders[index] = response.data
        }

        // Update current order if it's the one being updated
        if (this.currentOrder?.id === id) {
          this.currentOrder = response.data
        }

        this.success = true
        return response.data
      } catch (error: any) {
        console.error('Update order status error:', error)
        this.error = error.response?.data?.message || 'خطا در به‌روزرسانی وضعیت سفارش'
        this.success = false
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Cancel order (admin)
     */
    async cancelOrder(id: string): Promise<boolean> {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await apiClient.delete(`/orders/${id}`)

        // Update order status in list
        const index = this.orders.findIndex((order) => order.id === id)
        if (index !== -1) {
          this.orders[index].status = 'CANCELLED'
        }

        // Update current order if it's the one being cancelled
        if (this.currentOrder?.id === id) {
          this.currentOrder.status = 'CANCELLED'
        }

        this.success = true
        return true
      } catch (error: any) {
        console.error('Cancel order error:', error)
        this.error = error.response?.data?.message || 'خطا در لغو سفارش'
        this.success = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current order
     */
    clearCurrentOrder(): void {
      this.currentOrder = null
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

