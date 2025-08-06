import { z } from 'zod'

// Product schemas
export const productSchema = z.object({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().nullable().optional(),
  categoryIds: z.array(z.uuid()),
})

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateProductSchema = createProductSchema.partial()

export const productCategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  path: z.object({
    ids: z.array(z.uuid()),
    names: z.array(z.string()),
    slugs: z.array(z.string()),
    fullPath: z.string(),
  }).optional(),
})

export const productWithCategoriesSchema = productSchema.extend({
  categories: z.array(productCategorySchema),
  categoryPaths: z.array(z.string()),
}) 