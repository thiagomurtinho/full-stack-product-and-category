import { z } from 'zod'
import { 
  productSchema, 
  createProductSchema, 
  updateProductSchema, 
  productWithCategoriesSchema,
  productCategorySchema
} from './products.contract'

/**
 * Type representing a product entity.
 * Derived from productSchema Zod schema.
 */
export type Product = Readonly<z.infer<typeof productSchema>>

/**
 * Type representing data required to create a new product.
 * Derived from createProductSchema Zod schema.
 */
export type CreateProduct = Readonly<z.infer<typeof createProductSchema>>

/**
 * Type representing data for updating an existing product.
 * Derived from updateProductSchema Zod schema.
 */
export type UpdateProduct = Readonly<z.infer<typeof updateProductSchema>>

/**
 * Type representing a product with associated categories.
 * Derived from productWithCategoriesSchema Zod schema.
 */
export type ProductWithCategories = Readonly<z.infer<typeof productWithCategoriesSchema>>

/**
 * Type representing a category associated with a product.
 * Derived from productCategorySchema Zod schema.
 */
export type ProductCategory = Readonly<z.infer<typeof productCategorySchema>>

/**
 * Interface representing the count response from the API.
 * Used for pagination and statistics.
 */
export interface ProductCount {
  /** Total number of products */
  count: number
}

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedProducts {
  data: ProductWithCategories[]
  pagination: PaginationInfo
} 