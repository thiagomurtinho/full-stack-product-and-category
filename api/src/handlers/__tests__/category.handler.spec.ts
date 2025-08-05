import { Request, Response, NextFunction } from 'express'
import { createCategoryHandler } from '../category.handler'
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

describe('CategoryHandler', () => {
  let handler: ReturnType<typeof createCategoryHandler>
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
    handler = createCategoryHandler(mockCategoryRepository)
    
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    mockNext = jest.fn()
  })

  describe('getAll', () => {
    it('should return all categories without filters', async () => {
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
      mockRequest.query = {}

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.findAll).toHaveBeenCalledWith({
        limit: undefined,
        offset: undefined,
        search: undefined,
        parentId: undefined,
      })
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategories)
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
      mockRequest.query = {
        limit: '10',
        offset: '0',
        search: 'electronics',
        parentId: 'null',
      }

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        search: 'electronics',
        parentId: null,
      })
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategories)
    })

    it('should return 400 for invalid limit', async () => {
      mockRequest.query = { limit: '1000' }

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid limit parameter',
        message: 'Limit must be between 1 and 100',
      })
    })

    it('should return 400 for invalid offset', async () => {
      mockRequest.query = { offset: '-1' }

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid offset parameter',
        message: 'Offset must be 0 or greater',
      })
    })
  })

  describe('getById', () => {
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
      mockRequest.params = { id: '1' }

      await handler.getById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.findById).toHaveBeenCalledWith('1')
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategory)
    })

    it('should return 400 for invalid id', async () => {
      mockRequest.params = {}

      await handler.getById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid ID parameter',
        message: 'ID must be a valid string',
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null)
      mockRequest.params = { id: '999' }

      await handler.getById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category not found',
        message: 'Category with the specified ID does not exist',
      })
    })
  })

  describe('getBySlug', () => {
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
      mockRequest.params = { slug: 'electronics' }

      await handler.getBySlug(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.findBySlug).toHaveBeenCalledWith('electronics')
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategory)
    })

    it('should return 400 for invalid slug', async () => {
      mockRequest.params = {}

      await handler.getBySlug(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid slug parameter',
        message: 'Slug must be a valid string',
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.findBySlug.mockResolvedValue(null)
      mockRequest.params = { slug: 'non-existent' }

      await handler.getBySlug(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category not found',
        message: 'Category with the specified slug does not exist',
      })
    })
  })

  describe('getWithPath', () => {
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
      mockRequest.params = { slug: 'electronics' }

      await handler.getWithPath(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.findWithPath).toHaveBeenCalledWith('electronics')
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategoryWithPath)
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.findWithPath.mockResolvedValue(null)
      mockRequest.params = { slug: 'non-existent' }

      await handler.getWithPath(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category not found',
        message: 'Category with the specified slug does not exist',
      })
    })
  })

  describe('create', () => {
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
      mockRequest.body = createData

      await handler.create(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.create).toHaveBeenCalledWith(createData)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedCategory)
    })

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        slug: 'invalid-slug!', // Invalid: contains special characters
      }

      mockRequest.body = invalidData

      await handler.create(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation Error',
        message: 'Invalid category data provided',
        details: expect.any(Array),
      })
    })
  })

  describe('update', () => {
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
      mockRequest.params = { id: '1' }
      mockRequest.body = updateData

      await handler.update(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.update).toHaveBeenCalledWith('1', updateData)
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedCategory)
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.update.mockResolvedValue(null)
      mockRequest.params = { id: '999' }
      mockRequest.body = { name: 'Updated Electronics' }

      await handler.update(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category not found',
        message: 'Category with the specified ID does not exist',
      })
    })
  })

  describe('delete', () => {
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
      mockRequest.params = { id: '1' }

      await handler.delete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.delete).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(204)
      expect(mockResponse.send).toHaveBeenCalled()
    })

    it('should return 404 when category not found', async () => {
      mockCategoryRepository.delete.mockResolvedValue(null)
      mockRequest.params = { id: '999' }

      await handler.delete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Category not found',
        message: 'Category with the specified ID does not exist',
      })
    })
  })

  describe('count', () => {
    it('should return total count of categories', async () => {
      mockCategoryRepository.count.mockResolvedValue(5)

      await handler.count(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.count).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 5 })
    })
  })

  describe('getChildren', () => {
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
      mockRequest.params = { parentId: '1' }

      await handler.getChildren(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockCategoryRepository.getChildren).toHaveBeenCalledWith('1')
      expect(mockResponse.json).toHaveBeenCalledWith(mockChildren)
    })

    it('should return 400 for invalid parentId', async () => {
      mockRequest.params = {}

      await handler.getChildren(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid parentId parameter',
        message: 'Parent ID must be a valid string',
      })
    })
  })
}) 