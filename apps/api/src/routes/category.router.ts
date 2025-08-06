import { Router } from 'express'
import { CategoryRepository } from '../domain/categories/category.interface'
import { createCategoryHandler } from '../handlers/category.handler'

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management operations
 */

export const createCategoryRouter = (categoryRepository: CategoryRepository): Router => {
  const router = Router()
  const handler = createCategoryHandler(categoryRepository)

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     tags: [Categories]
   *     summary: List all categories
   *     description: Returns a paginated list of all categories
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by category name
   *     responses:
   *       200:
   *         description: List of categories returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Category'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       400:
   *         description: Invalid parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', handler.getAll)
  
  /**
   * @swagger
   * /api/categories/count:
   *   get:
   *     tags: [Categories]
   *     summary: Count total categories
   *     description: Returns the total number of categories in the system
   *     responses:
   *       200:
   *         description: Count returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 count:
   *                   type: integer
   *                   example: 42
   */
  router.get('/count', handler.count)
  
  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Find category by ID
   *     description: Returns a specific category by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Unique category ID
   *     responses:
   *       200:
   *         description: Category found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', handler.getById)
  
  /**
   * @swagger
   * /api/categories/slug/{slug}:
   *   get:
   *     tags: [Categories]
   *     summary: Find category by slug
   *     description: Returns a specific category by its slug
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^[a-z0-9-]+$'
   *         description: Unique category slug
   *     responses:
   *       200:
   *         description: Category found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/slug/:slug', handler.getBySlug)
  
  /**
   * @swagger
   * /api/categories/path/{slug}:
   *   get:
   *     tags: [Categories]
   *     summary: Find category with full path
   *     description: Returns a category with its complete hierarchical path
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^[a-z0-9-]+$'
   *         description: Category slug
   *     responses:
   *       200:
   *         description: Category with path found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryWithPath'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/path/:slug', handler.getWithPath)
  
  /**
   * @swagger
   * /api/categories/children/{parentId}:
   *   get:
   *     tags: [Categories]
   *     summary: List child categories
   *     description: Returns all child categories of a parent category
   *     parameters:
   *       - in: path
   *         name: parentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Parent category ID
   *     responses:
   *       200:
   *         description: List of child categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Category'
   *       404:
   *         description: Parent category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/children/:parentId', handler.getChildren)
  
  /**
   * @swagger
   * /api/categories:
   *   post:
   *     tags: [Categories]
   *     summary: Create a new category
   *     description: Creates a new category in the system
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCategory'
   *     responses:
   *       201:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Category with slug already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/', handler.create)
  
  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     tags: [Categories]
   *     summary: Update a category
   *     description: Updates an existing category
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Category ID to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCategory'
   *     responses:
   *       200:
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Category with slug already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', handler.update)
  
  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     tags: [Categories]
   *     summary: Delete a category
   *     description: Removes a category from the system (only if it has no children or products)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Category ID to delete
   *     responses:
   *       204:
   *         description: Category deleted successfully
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Category has child categories or products
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', handler.delete)

  return router
}
