# پنل ادمین مُرامُر - راهنمای پیاده‌سازی کامل

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [تکنولوژی‌های استفاده شده](#تکنولوژی‌های-استفاده-شده)
3. [ساختار پروژه](#ساختار-پروژه)
4. [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
5. [معماری پروژه](#معماری-پروژه)
6. [قابلیت‌های پیاده‌سازی شده](#قابلیت‌های-پیاده‌سازی-شده)
7. [استورها](#استورها)
8. [کامپوننت‌ها](#کامپوننت‌ها)
9. [روتینگ](#روتینگ)
10. [راهنمای توسعه](#راهنمای-توسعه)

---

## معرفی

این پروژه یک پنل ادمین کامل و حرفه‌ای است که با Vue 3، TypeScript، Pinia و Tailwind CSS پیاده‌سازی شده است. این پنل براساس API های مستند شده در `ADMIN_PANEL_API.md` طراحی و پیاده‌سازی شده است.

### ویژگی‌های کلیدی

- ✅ **معماری مدرن**: Vue 3 Composition API + TypeScript
- ✅ **مدیریت State**: Pinia با TypeScript
- ✅ **احراز هویت کامل**: Login, Logout, Token Refresh
- ✅ **مدیریت محصولات**: CRUD کامل با آپلود تصویر
- ✅ **مدیریت دسته‌بندی‌ها**: ایجاد و ویرایش دسته‌بندی‌ها
- ✅ **مدیریت سفارشات**: مشاهده، فیلتر و تغییر وضعیت
- ✅ **مدیریت کاربران**: مشاهده اطلاعات و سفارشات کاربران
- ✅ **مدیریت نظرات**: تایید و رد نظرات
- ✅ **داشبورد آماری**: نمایش آمار کلیدی
- ✅ **رابط کاربری زیبا**: Responsive و Modern UI
- ✅ **Error Handling**: مدیریت حرفه‌ای خطاها

---

## تکنولوژی‌های استفاده شده

### Frontend Framework
- **Vue 3.5+**: Latest Composition API
- **TypeScript 5.7+**: Type-safe development
- **Vite 6+**: Fast build tool

### State Management
- **Pinia 2.3+**: Vue official state management

### Styling
- **Tailwind CSS 3+**: Utility-first CSS
- **PrimeVue 4+**: UI Component Library

### HTTP Client
- **Axios 1.8+**: Promise-based HTTP client

### Routing
- **Vue Router 4+**: Official Vue router

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

---

## ساختار پروژه

```
src/
├── api/
│   └── axios.ts                 # Axios instance با interceptors
│
├── assets/
│   ├── logo.svg
│   └── main.css                 # Tailwind CSS imports
│
├── components/
│   ├── BaseModal.vue            # Modal component (existing)
│   ├── CreateCategory.vue       # Category form (existing)
│   ├── CreateWork.vue           # Work form (existing)
│   ├── ListCategory.vue         # Category list (existing)
│   └── ProductForm.vue          # Product form (reusable)
│
├── router/
│   └── index.ts                 # Route definitions + guards
│
├── stores/
│   ├── auth.ts                  # Authentication store
│   ├── products.ts              # Products store
│   ├── categories.ts            # Categories store
│   ├── orders.ts                # Orders store
│   ├── users.ts                 # Users store
│   ├── reviews.ts               # Reviews store
│   └── panel.ts                 # Panel store (existing)
│
├── types/
│   └── types.d.ts               # TypeScript type definitions
│
├── utils/
│   ├── auth.ts                  # Auth utilities (existing)
│   ├── imageGuard.ts            # Image utilities (existing)
│   └── upload.ts                # File upload utilities
│
├── views/
│   ├── DashboardView.vue        # Dashboard با آمار
│   ├── LoginUser.vue            # Login page (updated)
│   ├── HomeView.vue             # Home view (existing)
│   ├── NotFoundView.vue         # 404 page
│   │
│   ├── products/
│   │   ├── ProductsListView.vue      # لیست محصولات
│   │   ├── ProductCreateView.vue     # ایجاد محصول
│   │   └── ProductEditView.vue       # ویرایش محصول
│   │
│   ├── categories/
│   │   └── CategoriesListView.vue    # لیست دسته‌بندی‌ها
│   │
│   ├── orders/
│   │   ├── OrdersListView.vue        # لیست سفارشات
│   │   └── OrderDetailView.vue       # جزئیات سفارش
│   │
│   ├── users/
│   │   ├── UsersListView.vue         # لیست کاربران
│   │   └── UserDetailView.vue        # جزئیات کاربر
│   │
│   └── reviews/
│       └── ReviewsListView.vue       # لیست نظرات
│
├── App.vue                      # Layout با Sidebar
└── main.ts                      # App entry point
```

---

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18+ و npm/yarn/pnpm/bun
- API Backend در حال اجرا

### مراحل نصب

1. **کلون کردن پروژه**
```bash
cd admin-panel-hamed
```

2. **نصب Dependencies**
```bash
npm install
# یا
yarn install
# یا
pnpm install
# یا
bun install
```

3. **تنظیم Environment Variables**
```bash
cp .env.example .env
```

محتوای `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_ENV=development
VITE_APP_NAME=پنل ادمین مُرامُر
```

4. **اجرای Development Server**
```bash
npm run dev
```

5. **Build برای Production**
```bash
npm run build
```

### اطلاعات ورود پیش‌فرض

براساس API:
- **Email**: `admin@moramor.com`
- **Password**: `Admin@123456`

---

## معماری پروژه

### 1. Axios Instance (`src/api/axios.ts`)

یک instance مرکزی از Axios با قابلیت‌های زیر:
- افزودن خودکار `Authorization` header
- مدیریت خودکار `401` و `refresh token`
- مدیریت خطاها
- Logging در حالت Development

### 2. Type Safety (`src/types/types.d.ts`)

تمام تایپ‌های TypeScript براساس API:
- Request/Response interfaces
- Store state types
- Utility types
- Enum types (OrderStatus, PaymentStatus, etc.)

### 3. State Management (Pinia Stores)

هر store شامل:
- **State**: Data state با loading, error, success
- **Getters**: Computed values و فیلترها
- **Actions**: Async operations و mutations

### 4. Routing (`src/router/index.ts`)

- Lazy loading برای همه routes
- Navigation guards برای احراز هویت
- Meta data برای هر route
- Redirect logic

### 5. File Upload (`src/utils/upload.ts`)

- Validation (type, size)
- Single/Multiple image upload
- Progress tracking
- Preview generation
- Image compression

---

## قابلیت‌های پیاده‌سازی شده

### 1. احراز هویت
- [x] Login با validation
- [x] Logout
- [x] Token management (access + refresh)
- [x] Auto-redirect در صورت عدم احراز هویت
- [x] Check admin role

### 2. داشبورد
- [x] نمایش آمار کلیدی (محصولات، سفارشات، کاربران)
- [x] لیست آخرین سفارشات
- [x] لیست نظرات در انتظار تایید
- [x] لینک‌های سریع

### 3. مدیریت محصولات
- [x] لیست محصولات با pagination
- [x] جستجو و فیلتر (دسته‌بندی، قیمت، ویژه)
- [x] ایجاد محصول جدید
- [x] ویرایش محصول
- [x] حذف محصول (با تایید)
- [x] آپلود چند تصویر
- [x] مدیریت موجودی
- [x] تنظیمات SEO

### 4. مدیریت دسته‌بندی‌ها
- [x] لیست دسته‌بندی‌ها
- [x] ایجاد دسته‌بندی جدید
- [x] ویرایش دسته‌بندی
- [x] حذف دسته‌بندی (با تایید)
- [x] فعال/غیرفعال کردن
- [x] ترتیب نمایش

### 5. مدیریت سفارشات
- [x] لیست سفارشات با pagination
- [x] فیلتر بر اساس وضعیت
- [x] فیلتر بر اساس وضعیت پرداخت
- [x] مشاهده جزئیات سفارش
- [x] تغییر وضعیت سفارش
- [x] افزودن کد پیگیری
- [x] افزودن یادداشت ادمین
- [x] لغو سفارش

### 6. مدیریت کاربران
- [x] لیست کاربران با pagination
- [x] مشاهده جزئیات کاربر
- [x] مشاهده سفارشات کاربر
- [x] مشاهده آدرس‌های کاربر

### 7. مدیریت نظرات
- [x] لیست نظرات با pagination
- [x] فیلتر (تایید شده / در انتظار)
- [x] تایید نظر
- [x] حذف نظر (با تایید)
- [x] نمایش امتیاز ستاره‌ای

### 8. رابط کاربری
- [x] Responsive design (Mobile, Tablet, Desktop)
- [x] Sidebar navigation
- [x] Dark/Light badges
- [x] Loading states
- [x] Empty states
- [x] Error messages
- [x] Success notifications
- [x] Modal dialogs
- [x] Confirmation dialogs

---

## استورها

### Auth Store (`stores/auth.ts`)

```typescript
// State
- user: User | null
- accessToken: string | null
- refreshToken: string | null
- isLoading: boolean
- error: string | null

// Getters
- isAuthenticated: boolean
- isAdmin: boolean
- userRole: string
- userName: string

// Actions
- login(credentials)
- logout()
- fetchCurrentUser()
- refreshAccessToken()
- initializeAuth()
```

### Products Store (`stores/products.ts`)

```typescript
// State
- products: Product[]
- currentProduct: Product | null
- meta: PaginationMeta | null

// Getters
- featuredProducts
- activeProducts
- getProductsByCategory
- outOfStockProducts

// Actions
- fetchProducts(query)
- fetchProductById(id)
- createProduct(data)
- updateProduct(id, data)
- deleteProduct(id)
```

### Orders Store (`stores/orders.ts`)

```typescript
// State
- orders: Order[]
- currentOrder: Order | null
- meta: PaginationMeta | null

// Getters
- pendingOrders
- confirmedOrders
- totalRevenue

// Actions
- fetchOrders(query)
- fetchOrderById(id)
- updateOrderStatus(id, data)
- cancelOrder(id)
```

*سایر استورها به همین شکل...*

---

## کامپوننت‌ها

### Base Components

#### `BaseModal.vue`
Modal component با slots برای header, body, footer

```vue
<BaseModal @close="handleClose">
  <template #header>عنوان</template>
  <template #body>محتوا</template>
  <template #footer>دکمه‌ها</template>
</BaseModal>
```

#### `ProductForm.vue`
فرم قابل استفاده مجدد برای ایجاد و ویرایش محصول

```vue
<ProductForm
  :product="product"
  submit-label="ذخیره"
  @submit="handleSubmit"
/>
```

---

## روتینگ

### Public Routes
- `/login` - صفحه ورود

### Protected Routes (نیاز به احراز هویت)
- `/` - داشبورد
- `/products` - لیست محصولات
- `/products/create` - ایجاد محصول
- `/products/:id/edit` - ویرایش محصول
- `/categories` - لیست دسته‌بندی‌ها
- `/orders` - لیست سفارشات
- `/orders/:id` - جزئیات سفارش
- `/users` - لیست کاربران
- `/users/:id` - جزئیات کاربر
- `/reviews` - لیست نظرات

### Navigation Guards

```typescript
router.beforeEach(async (to, from, next) => {
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }
  
  // Check admin role
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }
  
  next()
})
```

---

## راهنمای توسعه

### افزودن صفحه جدید

1. **ایجاد View Component**
```vue
<!-- src/views/NewFeature/NewFeatureView.vue -->
<template>
  <div class="new-feature-view">
    <!-- محتوا -->
  </div>
</template>

<script setup lang="ts">
// Logic
</script>
```

2. **افزودن Route**
```typescript
// src/router/index.ts
{
  path: '/new-feature',
  name: 'new-feature',
  component: () => import('@/views/NewFeature/NewFeatureView.vue'),
  meta: {
    title: 'قابلیت جدید',
    requiresAuth: true,
    requiresAdmin: true,
  }
}
```

3. **افزودن Link در Sidebar**
```vue
<!-- src/App.vue -->
<router-link to="/new-feature">قابلیت جدید</router-link>
```

### ایجاد Store جدید

```typescript
// src/stores/newFeature.ts
import { defineStore } from 'pinia'
import apiClient from '@/api/axios'

export const useNewFeatureStore = defineStore('newFeature', {
  state: () => ({
    items: [],
    isLoading: false,
    error: null,
  }),
  
  getters: {
    // Computed values
  },
  
  actions: {
    async fetchItems() {
      this.isLoading = true
      try {
        const response = await apiClient.get('/endpoint')
        this.items = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
```

### افزودن Type جدید

```typescript
// src/types/types.d.ts
export interface NewFeature {
  id: string
  name: string
  // ... other fields
}
```

---

## Best Practices

### 1. Type Safety
همیشه از TypeScript استفاده کنید و `any` را avoid کنید.

### 2. Error Handling
همه API calls باید try-catch داشته باشند.

### 3. Loading States
همیشه loading state نمایش دهید.

### 4. Validation
Input validation در سمت client و server.

### 5. Code Splitting
از lazy loading برای routes استفاده کنید.

### 6. Performance
- از computed properties استفاده کنید
- Debounce برای search
- Pagination برای لیست‌های بزرگ

---

## مشکلات رایج و راه‌حل

### 1. خطای CORS
```typescript
// در axios.ts
baseURL: process.env.VITE_API_BASE_URL
```

### 2. Token Expired
Axios interceptor به صورت خودکار token را refresh می‌کند.

### 3. 404 Not Found
بررسی کنید که backend در حال اجراست.

---

## منابع و مستندات

- [Vue 3 Documentation](https://vuejs.org)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Axios](https://axios-http.com)

---

## نویسنده

این پروژه براساس `ADMIN_PANEL_API.md` و با رعایت `cursor rules` پیاده‌سازی شده است.

**تاریخ:** نوامبر 2024  
**نسخه:** 1.0.0

---

## مجوز

این پروژه تحت مجوز MIT است.

