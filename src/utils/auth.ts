import axios from 'axios'

// Function to set axios authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// Function to get current token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token')
}

// Function to save token
export const saveAuthToken = (token: string) => {
  localStorage.setItem('token', token)
  setAuthToken(token)
}

// Function to remove token
export const removeAuthToken = () => {
  localStorage.removeItem('token')
  setAuthToken(null)
}

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

// Initialize auth state
export const initializeAuth = () => {
  const token = getAuthToken()
  if (token) {
    setAuthToken(token)
  }
}
