/**
 * Image guard utility to safely handle image URLs
 * Ensures proper URL formatting and handles edge cases
 */

/**
 * Safely formats image URLs by adding the API base URL if needed
 * @param imageUrl - The image URL to process
 * @param baseUrl - The base URL to prepend (defaults to API URL)
 * @returns Formatted image URL or null if invalid
 */
export const getImageUrl = (
  imageUrl: string | null | undefined,
  baseUrl: string = 'http://api.hamedaei.com'
): string | null => {
  if (!imageUrl) return null

  // If the URL already starts with http/https, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // If it's a relative path, prepend the base URL
  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`
  }

  // If it doesn't start with /, add it
  return `${baseUrl}/${imageUrl}`
}

/**
 * Validates if an image URL is valid and accessible
 * @param imageUrl - The image URL to validate
 * @returns Promise<boolean> - True if image is valid and accessible
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Creates a fallback image URL for broken images
 * @param fallbackType - Type of fallback image ('placeholder', 'avatar', etc.)
 * @returns Fallback image URL
 */
export const getFallbackImageUrl = (fallbackType: string = 'placeholder'): string => {
  const fallbackUrls = {
    placeholder: 'https://via.placeholder.com/300x200?text=No+Image',
    avatar: 'https://via.placeholder.com/100x100?text=User',
    category: 'https://via.placeholder.com/300x200?text=Category'
  }

  return fallbackUrls[fallbackType as keyof typeof fallbackUrls] || fallbackUrls.placeholder
}
