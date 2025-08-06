import { z } from 'zod'
import { 
  categorySchema, 
  createCategorySchema, 
  updateCategorySchema, 
  categoryWithPathSchema 
} from './category.contract'

export type Category = Readonly<z.infer<typeof categorySchema>>
export type CreateCategory = Readonly<z.infer<typeof createCategorySchema>>
export type UpdateCategory = Readonly<z.infer<typeof updateCategorySchema>>
export type CategoryWithPath = Readonly<z.infer<typeof categoryWithPathSchema>> 