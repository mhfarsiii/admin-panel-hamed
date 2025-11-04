/**
 * Vue Router Configuration
 * Defines all routes and navigation guards for the admin panel
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Route meta interface
 */
interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

/**
 * Route definitions
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginUser.vue'),
    meta: {
      title: 'ورود به پنل ادمین',
      requiresAuth: false,
    } as RouteMeta,
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'داشبورد',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  // Products Routes
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/products/ProductsListView.vue'),
    meta: {
      title: 'مدیریت محصولات',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  {
    path: '/products/create',
    name: 'products-create',
    component: () => import('@/views/products/ProductCreateView.vue'),
    meta: {
      title: 'ایجاد محصول جدید',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  {
    path: '/products/:id/edit',
    name: 'products-edit',
    component: () => import('@/views/products/ProductEditView.vue'),
    meta: {
      title: 'ویرایش محصول',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  // Categories Routes
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/categories/CategoriesListView.vue'),
    meta: {
      title: 'مدیریت دسته‌بندی‌ها',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  // Orders Routes
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/orders/OrdersListView.vue'),
    meta: {
      title: 'مدیریت سفارشات',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  {
    path: '/orders/:id',
    name: 'orders-detail',
    component: () => import('@/views/orders/OrderDetailView.vue'),
    meta: {
      title: 'جزئیات سفارش',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  // Users Routes
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/users/UsersListView.vue'),
    meta: {
      title: 'مدیریت کاربران',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  {
    path: '/users/:id',
    name: 'users-detail',
    component: () => import('@/views/users/UserDetailView.vue'),
    meta: {
      title: 'جزئیات کاربر',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  // Reviews Routes
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('@/views/reviews/ReviewsListView.vue'),
    meta: {
      title: 'مدیریت نظرات',
      requiresAuth: true,
      requiresAdmin: true,
    } as RouteMeta,
  },
  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'صفحه یافت نشد',
    } as RouteMeta,
  },
]

/**
 * Create router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

/**
 * Global navigation guard
 * Handles authentication and authorization
 */
// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStore()

//   // Set page title
//   if (to.meta.title) {
//     document.title = `${to.meta.title} | پنل ادمین مُرامُر`
//   }

//   // Check if route requires authentication
//   if (to.meta.requiresAuth) {
//     // If not authenticated, redirect to login
//     if (!authStore.isAuthenticated) {
//       // Try to initialize auth from stored token
//       await authStore.initializeAuth()

//       // If still not authenticated, redirect to login
//       if (!authStore.isAuthenticated) {
//         next({
//           name: 'login',
//           query: { redirect: to.fullPath },
//         })
//         return
//       }
//     }

//     // Check if route requires admin role
//     if (to.meta.requiresAdmin && !authStore.isAdmin) {
//       console.error('دسترسی غیرمجاز: شما اجازه دسترسی به این صفحه را ندارید')
//       next({ name: 'dashboard' })
//       return
//     }
//   }

//   // If authenticated and trying to access login page, redirect to dashboard
//   if (to.name === 'login' && authStore.isAuthenticated) {
//     next({ name: 'dashboard' })
//     return
//   }

//   next()
// })

/**
 * Global error handler for navigation
 */
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
