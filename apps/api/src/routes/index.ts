import { Router } from 'express'
import { CategoryRepository } from '../domain/categories/category.interface'
import { ProductRepository } from '../domain/products/product.interface'
import { createHealthRouter } from './health.router'
import { createCategoryRouter } from './category.router'
import { createProductRouter } from './product.router'
import { createDocsRouter } from './docs.router'

export const createMainRouter = (
  categoryRepository: CategoryRepository,
  productRepository: ProductRepository
): Router => {
  const router = Router()

  // Mount health routes
  router.use('/health', createHealthRouter())
  
  // Mount category routes
  router.use('/categories', createCategoryRouter(categoryRepository))
  
  // Mount product routes
  router.use('/products', createProductRouter(productRepository))

  // Mount documentation routes
  router.use('/docs', createDocsRouter())

  return router
} 