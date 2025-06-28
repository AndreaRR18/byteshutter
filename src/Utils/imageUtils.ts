/**
 * Image utilities for handling images in both development and production environments
 */

/**
 * Gets the base path for images based on the current environment
 * Images are always served from the base URL + images/
 */
export const getImageBasePath = (): string => {
  const base = import.meta.env.BASE_URL || "/";

  // Ensure proper path construction
  // Remove trailing slash from base to avoid double slashes
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${cleanBase}/images/`;
};

/**
 * Gets the full URL for an image file
 * @param imageName - The name of the image file (e.g., 'hero_image.jpg')
 */
export const getImageUrl = (imageName: string): string => {
  const basePath = getImageBasePath();
  return `${basePath}${imageName}`;
};

/**
 * Generic function to get images from a specific folder
 * @param folderName - The folder name (e.g., 'images', 'photos')
 * @param imageName - The image file name
 */
export const getImageFromFolder = (
  folderName: string,
  imageName: string,
): string => {
  const base = import.meta.env.BASE_URL || "/";

  // Ensure proper path construction
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${cleanBase}/${folderName}/${imageName}`;
};

/**
 * Utility to preload images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[]): void => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};
