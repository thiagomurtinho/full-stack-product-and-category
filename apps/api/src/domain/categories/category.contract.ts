import { z } from 'zod'

/**
 * Base schema for entities with common fields.
 */
export const baseEntitySchema = z.object({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Schema for validating slugs.
 */
export const slugSchema = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/)

/**
 * Schema for a path segment.
 */
export const pathSegmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
})

/**
 * Schema for a category path.
 */
export const categoryPathSchema = z.object({
  ids: z.array(z.uuid()),
  names: z.array(z.string()),
  slugs: z.array(z.string()),
  fullPath: z.string(),
})

/**
 * Schema for a category entity.
 */
export const categorySchema = baseEntitySchema.extend({
  name: z.string().min(1).max(100),
  slug: slugSchema,
  parentId: z.uuid().nullable(),
})

/**
 * Schema for creating a new category.
 */
export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  parentId: z.uuid().nullable().optional(),
})

/**
 * Schema for updating an existing category.
 */
export const updateCategorySchema = createCategorySchema.partial()

/**
 * Schema for a category with its path and children.
 */
export const categoryWithPathSchema = categorySchema.extend({
  path: categoryPathSchema.optional(),
  children: z.array(categorySchema).optional(),
})