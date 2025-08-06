import { z } from 'zod'

/**
 * Base Zod schema for all entities in the application.
 * Includes common fields like id, createdAt, and updatedAt.
 */
export const baseEntitySchema = z.object({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Zod schema for API response data that includes date strings.
 * Converts date strings to Date objects during validation.
 * Updated to handle more flexible date string formats.
 */
export const apiBaseEntitySchema = z.object({
  id: z.uuid(),
  createdAt: z.union([
    z.string().refine((str) => !isNaN(Date.parse(str)), {
      message: 'Invalid date string for createdAt'
    }).transform((str) => new Date(str)),
    z.date()
  ]),
  updatedAt: z.union([
    z.string().refine((str) => !isNaN(Date.parse(str)), {
      message: 'Invalid date string for updatedAt'
    }).transform((str) => new Date(str)),
    z.date()
  ]),
})

/**
 * Zod schema for validating URL-friendly slugs.
 * Ensures slugs contain only lowercase letters, numbers, and hyphens.
 */
export const slugSchema = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/)

/**
 * Zod schema for validating path segments in hierarchical structures.
 * Used for category paths and navigation breadcrumbs.
 */
export const pathSegmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
})

/**
 * Zod schema for validating category hierarchical paths.
 * Contains arrays of IDs, names, and slugs that form the complete path.
 */
export const categoryPathSchema = z.object({
  ids: z.array(z.uuid()),
  names: z.array(z.string()),
  slugs: z.array(z.string()),
  fullPath: z.string(),
})

/**
 * Zod schema for validating API error responses.
 * Used for consistent error handling across the application.
 */
export const apiErrorSchema = z.object({
  message: z.string(),
  status: z.number().optional(),
})

/**
 * Zod schema for validating pagination parameters.
 * Used for API endpoints that support pagination.
 */
export const paginationSchema = z.object({
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
})

/**
 * Zod schema for validating count response objects.
 * Used for endpoints that return total counts for pagination.
 */
export const countResponseSchema = z.object({
  count: z.number(),
}) 