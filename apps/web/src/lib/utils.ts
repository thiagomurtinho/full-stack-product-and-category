import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge.
 * This function merges multiple class names and resolves Tailwind CSS conflicts.
 * 
 * @param {...ClassValue[]} inputs - The class names to combine
 * @returns {string} The combined and optimized class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a URL-friendly slug from a given string.
 * Converts the input string to lowercase, removes special characters,
 * replaces spaces with hyphens, and ensures the result is valid for URLs.
 * 
 * @param {string} name - The input string to generate the slug from
 * @returns {string} The generated URL-friendly slug
 */
export function generateSlug(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'product'
  }
  
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .replace(/^-|-$/g, '') // Remove hyphens at the start and end
  
  // If the slug is empty after cleaning, return 'product'
  return slug || 'product'
}
