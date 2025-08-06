import { z } from 'zod'
import { 
  productSchema, 
  createProductSchema, 
  updateProductSchema, 
  productWithCategoriesSchema 
} from './product.contract'

export type Product = Readonly<z.infer<typeof productSchema>>
export type CreateProduct = Readonly<z.infer<typeof createProductSchema>>
export type UpdateProduct = Readonly<z.infer<typeof updateProductSchema>>
export type ProductWithCategories = Readonly<z.infer<typeof productWithCategoriesSchema>>

export interface ProductCategory {
  id: string
  name: string
  slug: string
  path?: {
    ids: string[]
    names: string[]
    slugs: string[]
    fullPath: string
  }
} 