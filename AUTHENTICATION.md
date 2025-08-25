# Authentication System

This document explains how the authentication system works in the admin panel.

## Overview

The authentication system uses JWT tokens stored in localStorage and automatically manages axios headers for API requests.

## Key Components

### 1. Auth Utility (`src/utils/auth.ts`)

Centralized authentication functions:

- `setAuthToken(token)`: Sets axios authorization header
- `getAuthToken()`: Gets current token from localStorage
- `saveAuthToken(token)`: Saves token to localStorage and sets axios header
- `removeAuthToken()`: Removes token and clears axios header
- `isAuthenticated()`: Checks if user is authenticated
- `initializeAuth()`: Initializes auth state on app startup

### 2. Axios Interceptors (`src/main.ts`)

- Automatically handles 401 errors (unauthorized)
- Redirects to login page when token is invalid/expired
- Clears token and headers on authentication failure

### 3. Router Guards (`src/router/index.ts`)

- Protects routes that require authentication
- Redirects unauthenticated users to login page

### 4. Store Integration (`src/stores/panel.ts`)

- Provides `isAuthenticated` getter
- Provides `logout()` action for proper token cleanup

## Authentication Flow

1. **Login**: User enters credentials → API returns token → Token saved to localStorage → Axios headers updated → Redirect to dashboard
2. **API Requests**: All requests automatically include Authorization header with token
3. **Token Expiration**: 401 response → Token removed → Redirect to login
4. **Logout**: Token removed → Headers cleared → Redirect to login

## Usage

### Login

```typescript
import { saveAuthToken } from '@/utils/auth'

// After successful login API call
saveAuthToken(token)
```

### Logout

```typescript
import { usePanelStore } from '@/stores/panel'

const panelStore = usePanelStore()
panelStore.logout()
```

### Check Authentication

```typescript
import { isAuthenticated } from '@/utils/auth'

if (isAuthenticated()) {
  // User is logged in
}
```

## Security Features

- Automatic token management
- Automatic logout on token expiration
- Protected routes
- Centralized authentication state
- Proper cleanup on logout

## Files Modified

- `src/main.ts`: Added axios interceptors and auth initialization
- `src/utils/auth.ts`: New authentication utility functions
- `src/views/LoginUser.vue`: Updated to use auth utility
- `src/stores/panel.ts`: Updated to use auth utility
- `src/views/HomeView.vue`: Updated logout to use store method
