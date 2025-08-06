import request from 'supertest'
import express from 'express'
import { createCategoryRouter } from '../category.router'
import { CategoryRepository } from '../../domain/categories/category.interface'
import { Category } from '../../domain/categories/category.types'

// Mock do CategoryRepository
const mockCategoryRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  findWithPath: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  getChildren: jest.fn(),
  getCategoryPath: jest.fn(),
  buildCategoryPath: jest.fn(),
} as jest.Mocked<CategoryRepository>

describe('CategoryRouter Integration Tests', () => {
  let app: express.Application

  beforeEach(() => {
    jest.clearAllMocks()
    
    app = express()
    app.use(express.json())
    
    const categoryRouter = createCategoryRouter(mockCategoryRepository)
    app.use('/api/categories', categoryRouter)
  })

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockCategoryRepository.findAll.mockResolvedValue(mockCategories)

      const response = await request(app)
        .get('/api/categories')
        .expect(200)

      expect(mockCategoryRepository.findAll).toHaveBeenCalledWith({
        limit: undefined,
        offset: undefined,
        search: undefined,
        parentId: undefined,
      })
      // Compare without dates since they get serialized
      expect(response.body[0]).toMatchObject({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    })

    it('should return categories with filters', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockCategoryRepository.findAll.mockResolvedValue(mockCategories)

      const response = await request(app)
        .get('/api/categories?limit=10&offset=0&search=electronics&parentId=null')
        .expect(200)

      expect(mockCategoryRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        search: 'electronics',
        parentId: null,
      })
      // Compare without dates since they get serialized
      expect(response.body[0]).toMatchObject({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    })

    it('should return 400 for invalid limit', async () => {
      const response = await request(app)
        .get('/api/categories?limit=1000')
        .expect(400)

      expect(response.body).toEqual({
        error: 'Invalid limit parameter',
        message: 'Limit must be between 1 and 100',
      })
    })
  })

  describe('GET /api/categories/count', () => {
    it('should return category count', async () => {
      mockCategoryRepository.count.mockResolvedValue(5)

      const response = await request(app)
        .get('/api/categories/count')
        .expect(200)

      expect(mockCategoryRepository.count).toHaveBeenCalled()
      expect(response.body).toEqual({ count: 5 })
    })
  })

  describe('GET /api/categories/:id', () => {
    it('should return category by id', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCategoryRepository.findById.mockResolvedValue(mockCategory)

      const response = await request(app)
        .get('/api/categories/1')
        .expect(200)

      expect(mockCategoryRepository.findById).toHaveBeenCalledWith('1')
      // Compare without dates since they get serialized
      expect(response.body).toMatchObject({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/categories/999')
        .expect(404)

      expect(response.body).toEqual({
        error: 'Category not found',
        message: 'Category with the specified ID does not exist',
      })
    })
  })

  describe('GET /api/categories/slug/:slug', () => {
    it('should return category by slug', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCategoryRepository.findBySlug.mockResolvedValue(mockCategory)

      const response = await request(app)
        .get('/api/categories/slug/electronics')
        .expect(200)

      expect(mockCategoryRepository.findBySlug).toHaveBeenCalledWith('electronics')
      // Compare without dates since they get serialized
      expect(response.body).toMatchObject({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.findBySlug.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/categories/slug/non-existent')
        .expect(404)

      expect(response.body).toEqual({
        error: 'Category not found',
        message: 'Category with the specified slug does not exist',
      })
    })
  })

  describe('GET /api/categories/path/:slug', () => {
    it('should return category with path', async () => {
      const mockCategoryWithPath = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        path: {
          ids: ['1'],
          names: ['Electronics'],
          slugs: ['electronics'],
          fullPath: 'electronics',
        },
      }

      mockCategoryRepository.findWithPath.mockResolvedValue(mockCategoryWithPath)

      const response = await request(app)
        .get('/api/categories/path/electronics')
        .expect(200)

      expect(mockCategoryRepository.findWithPath).toHaveBeenCalledWith('electronics')
      // Compare without dates since they get serialized
      expect(response.body).toMatchObject({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        path: {
          ids: ['1'],
          names: ['Electronics'],
          slugs: ['electronics'],
          fullPath: 'electronics',
        },
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.findWithPath.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/categories/path/non-existent')
        .expect(404)

      expect(response.body).toEqual({
        error: 'Category not found',
        message: 'Category with the specified slug does not exist',
      })
    })
  })

  describe('GET /api/categories/children/:parentId', () => {
    it('should return children categories', async () => {
      const mockChildren: Category[] = [
        {
          id: '2',
          name: 'Laptops',
          slug: 'laptops',
          parentId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockCategoryRepository.getChildren.mockResolvedValue(mockChildren)

      const response = await request(app)
        .get('/api/categories/children/1')
        .expect(200)

      expect(mockCategoryRepository.getChildren).toHaveBeenCalledWith('1')
      // Compare without dates since they get serialized
      expect(response.body[0]).toMatchObject({
        id: '2',
        name: 'Laptops',
        slug: 'laptops',
        parentId: '1',
      })
    })
  })

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const createData = {
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      }

      const mockCreatedCategory: Category = {
        id: '1',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCategoryRepository.create.mockResolvedValue(mockCreatedCategory)

      const response = await request(app)
        .post('/api/categories')
        .send(createData)
        .expect(201)

      expect(mockCategoryRepository.create).toHaveBeenCalledWith(createData)
      // Compare without dates since they get serialized
      expect(response.body).toMatchObject({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    })

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        slug: 'invalid-slug!', // Invalid: contains special characters
      }

      const response = await request(app)
        .post('/api/categories')
        .send(invalidData)
        .expect(400)

      expect(response.body).toEqual({
        error: 'Validation Error',
        message: 'Invalid category data provided',
        details: expect.any(Array),
      })
    })
  })

  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      const updateData = {
        name: 'Updated Electronics',
      }

      const mockUpdatedCategory: Category = {
        id: '1',
        name: 'Updated Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCategoryRepository.update.mockResolvedValue(mockUpdatedCategory)

      const response = await request(app)
        .put('/api/categories/1')
        .send(updateData)
        .expect(200)

      expect(mockCategoryRepository.update).toHaveBeenCalledWith('1', updateData)
      // Compare without dates since they get serialized
      expect(response.body).toMatchObject({
        id: '1',
        name: 'Updated Electronics',
        slug: 'electronics',
        parentId: null,
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.update.mockResolvedValue(null)

      const response = await request(app)
        .put('/api/categories/999')
        .send({ name: 'Updated Electronics' })
        .expect(404)

      expect(response.body).toEqual({
        error: 'Category not found',
        message: 'Category with the specified ID does not exist',
      })
    })
  })

  describe('DELETE /api/categories/:id', () => {
    it('should delete an existing category', async () => {
      const mockDeletedCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockCategoryRepository.delete.mockResolvedValue(mockDeletedCategory)

      await request(app)
        .delete('/api/categories/1')
        .expect(204)

      expect(mockCategoryRepository.delete).toHaveBeenCalledWith('1')
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.delete.mockResolvedValue(null)

      const response = await request(app)
        .delete('/api/categories/999')
        .expect(404)

      expect(response.body).toEqual({
        error: 'Category not found',
        message: 'Category with the specified ID does not exist',
      })
    })
  })
}) 