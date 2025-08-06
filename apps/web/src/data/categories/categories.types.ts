import { z } from 'zod'
import { 
  categorySchema, 
  createCategorySchema, 
  updateCategorySchema, 
  categoryWithPathSchema 
} from './categories.contract'

/**
 * Type representing a category entity.
 * Derived from categorySchema Zod schema.
 */
export type Category = Readonly<z.infer<typeof categorySchema>>
/**
 * Type representing data required to create a new category.
 * Derived from createCategorySchema Zod schema.
 */
export type CreateCategory = Readonly<z.infer<typeof createCategorySchema>>

/**
 * Type representing data for updating an existing category.
 * Derived from updateCategorySchema Zod schema.
 */
export type UpdateCategory = Readonly<z.infer<typeof updateCategorySchema>>

/**
 * Type representing a category with hierarchical path information.
 * Derived from categoryWithPathSchema Zod schema.
 */
export type CategoryWithPath = Readonly<z.infer<typeof categoryWithPathSchema>>

/**
 * Interface representing the hierarchical path of a category.
 * Contains arrays of IDs, names, and slugs that form the complete path from root to the category.
 */
export interface CategoryPath {
  /** Array of category IDs from root to current category */
  ids: string[]
  /** Array of category names from root to current category */
  names: string[]
  /** Array of category slugs from root to current category */
  slugs: string[]
  /** Full hierarchical path as a string (e.g., "electronics/computers/laptops") */
  fullPath: string
} 