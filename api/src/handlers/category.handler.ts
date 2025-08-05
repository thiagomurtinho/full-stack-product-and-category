import { Request, Response, NextFunction } from 'express'
import { CategoryRepository } from '../domain/categories/category.interface'
import { createCategorySchema, updateCategorySchema } from '../domain/categories/category.contract'
import { ZodError } from 'zod'

/**
 * Creates a handler for managing category-related HTTP requests.
 * @param {CategoryRepository} categoryRepository - The category repository instance.
 * @returns {Object} - The category handler methods.
 */
export const createCategoryHandler = (categoryRepository: CategoryRepository) => ({
  /**
   * Retrieves all categories based on query parameters.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset, search, parentId } = req.query
      
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

      const categories = await categoryRepository.findAll({
        limit: limitNum,
        offset: offsetNum,
        search: search as string,
        parentId: parentId === 'null' ? null : parentId as string,
      })
      res.json(categories)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves a category by its unique ID.
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

      const category = await categoryRepository.findById(id)
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: 'Category with the specified ID does not exist' 
        })
      }
      res.json(category)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves a category by its slug.
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

      const category = await categoryRepository.findBySlug(slug)
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: 'Category with the specified slug does not exist' 
        })
      }
      res.json(category)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves a category along with its path by its slug.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getWithPath(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params
      
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid slug parameter',
          message: 'Slug must be a valid string' 
        })
      }

      const category = await categoryRepository.findWithPath(slug)
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: 'Category with the specified slug does not exist' 
        })
      }
      res.json(category)
    } catch (error) {
      next(error)
    }
  },

  /**
   * Creates a new category.
   * @param {Request} req - The HTTP request object containing the category data.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCategorySchema.parse(req.body)
      const category = await categoryRepository.create(validatedData)
      res.status(201).json(category)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid category data provided',
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
   * Updates an existing category.
   * @param {Request} req - The HTTP request object containing the updated category data.
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

      const validatedData = updateCategorySchema.parse(req.body)
      const category = await categoryRepository.update(id, validatedData)
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: 'Category with the specified ID does not exist' 
        })
      }
      res.json(category)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid category data provided',
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
   * Deletes a category by its unique ID.
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

      const category = await categoryRepository.delete(id)
      if (!category) {
        return res.status(404).json({ 
          error: 'Category not found',
          message: 'Category with the specified ID does not exist' 
        })
      }
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },

  /**
   * Counts the total number of categories.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async count(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await categoryRepository.count()
      res.json({ count })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Retrieves the children of a category by its parent ID.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function.
   */
  async getChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentId } = req.params
      
      if (!parentId || typeof parentId !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid parentId parameter',
          message: 'Parent ID must be a valid string' 
        })
      }

      const children = await categoryRepository.getChildren(parentId)
      res.json(children)
    } catch (error) {
      next(error)
    }
  },
})