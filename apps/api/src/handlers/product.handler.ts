import { Request, Response, NextFunction } from 'express'
import { ProductRepository } from '../domain/products/product.interface'
import { createProductSchema, updateProductSchema } from '../domain/products/product.contract'
import { ZodError } from 'zod'

/**
 * Creates a handler for managing product-related HTTP requests.
 * @param {ProductRepository} productRepository - The product repository instance.
 * @returns {Object} - The product handler methods.
 */
export const createProductHandler = (productRepository: ProductRepository) => ({
  /**
   * Retrieves all products based on query parameters.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        limit, 
        offset, 
        search, 
        categoryIds, 
        minPrice, 
        maxPrice, 
        orderBy, 
        orderDirection 
      } = req.query
      
      // Validate query parameters
      const limitNum = limit ? parseInt(limit as string) : undefined
      const offsetNum = offset ? parseInt(offset as string) : undefined
      
      if (limitNum !== undefined && (limitNum < 1 || limitNum > 100)) {
        return res.status(400).json({ 
          error: 'Invalid limit parameter',
          message: 'Limit must be between 1 and 100' 
        })
      }
      
      if (offsetNum !== undefined && offsetNum < 0) {
        return res.status(400).json({ 
          error: 'Invalid offset parameter',
          message: 'Offset must be 0 or greater' 
        })
      }

      const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined
      const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined
      
      if (minPriceNum !== undefined && minPriceNum < 0) {
        return res.status(400).json({ 
          error: 'Invalid minPrice parameter',
          message: 'Min price must be 0 or greater' 
        })
      }
      
      if (maxPriceNum !== undefined && maxPriceNum < 0) {
        return res.status(400).json({ 
          error: 'Invalid maxPrice parameter',
          message: 'Max price must be 0 or greater' 
        })
      }
      
      if (minPriceNum !== undefined && maxPriceNum !== undefined && minPriceNum > maxPriceNum) {
        return res.status(400).json({ 
          error: 'Invalid price range',
          message: 'Min price cannot be greater than max price' 
        })
      }
      
      // Fetch products from repository
      const result = await productRepository.findAll({
        limit: limitNum,
        offset: offsetNum,
        search: search as string,
        categoryIds: categoryIds ? (categoryIds as string).split(',') : undefined,
        minPrice: minPriceNum,
        maxPrice: maxPriceNum,
        orderBy: orderBy as 'name' | 'price' | 'createdAt',
        orderDirection: orderDirection as 'asc' | 'desc',
      })
      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves a product by its unique ID.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid ID parameter',
          message: 'ID must be a valid string' 
        })
      }

      const product = await productRepository.findById(id)
      if (!product) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'Product with the specified ID does not exist' 
        })
      }
      res.json(product)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves a product by its slug.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params
      
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid slug parameter',
          message: 'Slug must be a valid string' 
        })
      }

      const product = await productRepository.findBySlug(slug)
      if (!product) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'Product with the specified slug does not exist' 
        })
      }
      res.json(product)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Creates a new product.
   * @param {Request} req - The HTTP request object containing the product data.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProductSchema.parse(req.body)
      const product = await productRepository.create(validatedData)
      res.status(201).json(product)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid product data provided',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
      }
      next(error)
    }
  },

  /**
   * Updates an existing product.
   * @param {Request} req - The HTTP request object containing the updated product data.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid ID parameter',
          message: 'ID must be a valid string' 
        })
      }

      const validatedData = updateProductSchema.parse(req.body)
      const product = await productRepository.update(id, validatedData)
      if (!product) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'Product with the specified ID does not exist' 
        })
      }
      res.json(product)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid product data provided',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
      }
      next(error)
    }
  },

  /**
   * Deletes a product by its unique ID.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid ID parameter',
          message: 'ID must be a valid string' 
        })
      }

      const product = await productRepository.delete(id)
      if (!product) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'Product with the specified ID does not exist' 
        })
      }
      
      res.status(204).send()
    } catch (error: any) {
      console.error('Delete error:', error)
      next(error)
    }
  },

  /**
   * Counts the total number of products.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async count(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await productRepository.count()
      res.json({ count })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves products by their category path.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getByCategoryPath(req: Request, res: Response, next: NextFunction) {
    try {
      const { path } = req.params
      
      if (!path || typeof path !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid path parameter',
          message: 'Path must be a valid string' 
        })
      }

      const categoryPath = path.split('/')
      if (categoryPath.length === 0) {
        return res.status(400).json({ 
          error: 'Invalid category path',
          message: 'Category path cannot be empty' 
        })
      }

      const products = await productRepository.findByCategoryPath(categoryPath)
      res.json(products)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Searches for products using a query string.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ 
          error: 'Missing query parameter',
          message: 'Query parameter "q" is required and must be a string' 
        })
      }
      
      if (q.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Empty query',
          message: 'Query parameter "q" cannot be empty' 
        })
      }
      
      const products = await productRepository.searchByFuzzyMatch(q)
      res.json(products)
    } catch (error) {
      next(error)
    }
  },
})