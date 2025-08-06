import { Request, Response, NextFunction } from 'express'
import { createProductHandler } from '../product.handler'
import { ProductRepository } from '../../domain/products/product.interface'
import { ProductWithCategories } from '../../domain/products/product.types'

// Mock do ProductRepository
const mockProductRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  countWithFilters: jest.fn(),
  findByCategoryPath: jest.fn(),
  searchByFuzzyMatch: jest.fn(),
  enrichProductWithPaths: jest.fn(),
  enrichProductsWithPaths: jest.fn(),
  buildCategoryPath: jest.fn(),
} as jest.Mocked<ProductRepository>

describe('ProductHandler', () => {
  let handler: ReturnType<typeof createProductHandler>
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
    handler = createProductHandler(mockProductRepository)
    
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    mockNext = jest.fn()
  })

  describe('getAll', () => {
    it('should return all products without filters', async () => {
      const mockProducts = {
        data: [
          {
            id: '1',
            name: 'MacBook Pro',
            slug: 'macbook-pro',
            description: 'Powerful laptop',
            price: 1999.99,
            imageUrl: 'https://example.com/macbook.jpg',
            categoryIds: ['1'],
            createdAt: new Date(),
            updatedAt: new Date(),
            categories: [
              {
                id: '1',
                name: 'Electronics',
                slug: 'electronics',
                path: {
                  ids: ['1'],
                  names: ['Electronics'],
                  slugs: ['electronics'],
                  fullPath: 'electronics',
                },
              },
            ],
            categoryPaths: ['electronics'],
          },
        ],
        pagination: {
          total: 1,
          limit: 10,
          offset: 0,
          totalPages: 1,
          currentPage: 1,
          hasNext: false,
          hasPrev: false,
        },
      }

      mockProductRepository.findAll.mockResolvedValue(mockProducts)
      mockRequest.query = {}

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        limit: undefined,
        offset: undefined,
        search: undefined,
        categoryIds: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        orderBy: undefined,
        orderDirection: undefined,
      })
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts)
    })

    it('should return products with filters', async () => {
      const mockProducts = {
        data: [
          {
            id: '1',
            name: 'MacBook Pro',
            slug: 'macbook-pro',
            description: 'Powerful laptop',
            price: 1999.99,
            imageUrl: 'https://example.com/macbook.jpg',
            categoryIds: ['1'],
            createdAt: new Date(),
            updatedAt: new Date(),
            categories: [
              {
                id: '1',
                name: 'Electronics',
                slug: 'electronics',
                path: {
                  ids: ['1'],
                  names: ['Electronics'],
                  slugs: ['electronics'],
                  fullPath: 'electronics',
                },
              },
            ],
            categoryPaths: ['electronics'],
          },
        ],
        pagination: {
          total: 1,
          limit: 10,
          offset: 0,
          totalPages: 1,
          currentPage: 1,
          hasNext: false,
          hasPrev: false,
        },
      }

      mockProductRepository.findAll.mockResolvedValue(mockProducts)
      mockRequest.query = {
        limit: '10',
        offset: '0',
        search: 'macbook',
        categoryIds: '1,2',
        minPrice: '1000',
        maxPrice: '2000',
        orderBy: 'price',
        orderDirection: 'asc',
      }

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        search: 'macbook',
        categoryIds: ['1', '2'],
        minPrice: 1000,
        maxPrice: 2000,
        orderBy: 'price',
        orderDirection: 'asc',
      })
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts)
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

    it('should return 400 for invalid price range', async () => {
      mockRequest.query = { minPrice: '2000', maxPrice: '1000' }

      await handler.getAll(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid price range',
        message: 'Min price cannot be greater than max price',
      })
    })
  })

  describe('getById', () => {
    it('should return product by id', async () => {
      const mockProduct: ProductWithCategories = {
        id: '1',
        name: 'MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 1999.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            path: {
              ids: ['1'],
              names: ['Electronics'],
              slugs: ['electronics'],
              fullPath: 'electronics',
            },
          },
        ],
        categoryPaths: ['electronics'],
      }

      mockProductRepository.findById.mockResolvedValue(mockProduct)
      mockRequest.params = { id: '1' }

      await handler.getById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.findById).toHaveBeenCalledWith('1')
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct)
    })

    it('should return 404 when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null)
      mockRequest.params = { id: '999' }

      await handler.getById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Product not found',
        message: 'Product with the specified ID does not exist',
      })
    })
  })

  describe('getBySlug', () => {
    it('should return product by slug', async () => {
      const mockProduct: ProductWithCategories = {
        id: '1',
        name: 'MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 1999.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            path: {
              ids: ['1'],
              names: ['Electronics'],
              slugs: ['electronics'],
              fullPath: 'electronics',
            },
          },
        ],
        categoryPaths: ['electronics'],
      }

      mockProductRepository.findBySlug.mockResolvedValue(mockProduct)
      mockRequest.params = { slug: 'macbook-pro' }

      await handler.getBySlug(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.findBySlug).toHaveBeenCalledWith('macbook-pro')
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct)
    })

    it('should return 404 when product not found', async () => {
      mockProductRepository.findBySlug.mockResolvedValue(null)
      mockRequest.params = { slug: 'non-existent' }

      await handler.getBySlug(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Product not found',
        message: 'Product with the specified slug does not exist',
      })
    })
  })

  describe('create', () => {
    it('should create a new product', async () => {
      const createData = {
        name: 'MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 1999.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryIds: ['8ee9047e-4f7a-4cee-962f-00e4e1bd34d4'],
      }

      const mockCreatedProduct: ProductWithCategories = {
        id: '8ee9047e-4f7a-4cee-962f-00e4e1bd34d4',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            id: '8ee9047e-4f7a-4cee-962f-00e4e1bd34d4',
            name: 'Electronics',
            slug: 'electronics',
            path: {
              ids: ['8ee9047e-4f7a-4cee-962f-00e4e1bd34d4'],
              names: ['Electronics'],
              slugs: ['electronics'],
              fullPath: 'electronics',
            },
          },
        ],
        categoryPaths: ['electronics'],
      }

      mockProductRepository.create.mockResolvedValue(mockCreatedProduct)
      mockRequest.body = createData

      await handler.create(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedProduct)
    })

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        price: -100, // Invalid: negative price
        slug: 'invalid-slug!', // Invalid: contains special characters
      }

      mockRequest.body = invalidData

      await handler.create(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation Error',
        message: 'Invalid product data provided',
        details: expect.any(Array),
      })
    })
  })

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated MacBook Pro',
        price: 2499.99,
      }

      const mockUpdatedProduct: ProductWithCategories = {
        id: '1',
        name: 'Updated MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 2499.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            path: {
              ids: ['1'],
              names: ['Electronics'],
              slugs: ['electronics'],
              fullPath: 'electronics',
            },
          },
        ],
        categoryPaths: ['electronics'],
      }

      mockProductRepository.update.mockResolvedValue(mockUpdatedProduct)
      mockRequest.params = { id: '1' }
      mockRequest.body = updateData

      await handler.update(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.update).toHaveBeenCalledWith('1', updateData)
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedProduct)
    })

    it('should return 404 when product not found', async () => {
      mockProductRepository.update.mockResolvedValue(null)
      mockRequest.params = { id: '999' }
      mockRequest.body = { name: 'Updated MacBook Pro' }

      await handler.update(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Product not found',
        message: 'Product with the specified ID does not exist',
      })
    })
  })

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const mockDeletedProduct: ProductWithCategories = {
        id: '1',
        name: 'MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 1999.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            path: {
              ids: ['1'],
              names: ['Electronics'],
              slugs: ['electronics'],
              fullPath: 'electronics',
            },
          },
        ],
        categoryPaths: ['electronics'],
      }

      mockProductRepository.delete.mockResolvedValue(mockDeletedProduct)
      mockRequest.params = { id: '1' }

      await handler.delete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.delete).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(204)
      expect(mockResponse.send).toHaveBeenCalled()
    })

    it('should return 404 when product not found', async () => {
      mockProductRepository.delete.mockResolvedValue(null)
      mockRequest.params = { id: '999' }

      await handler.delete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Product not found',
        message: 'Product with the specified ID does not exist',
      })
    })
  })

  describe('count', () => {
    it('should return total count of products', async () => {
      mockProductRepository.count.mockResolvedValue(10)

      await handler.count(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.count).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 10 })
    })
  })

  describe('getByCategoryPath', () => {
    it('should return products by category path', async () => {
      const mockProducts: ProductWithCategories[] = [
        {
          id: '1',
          name: 'MacBook Pro',
          slug: 'macbook-pro',
          description: 'Powerful laptop',
          price: 1999.99,
          imageUrl: 'https://example.com/macbook.jpg',
          categoryIds: ['1'],
          createdAt: new Date(),
          updatedAt: new Date(),
          categories: [
            {
              id: '1',
              name: 'Electronics',
              slug: 'electronics',
              path: {
                ids: ['1'],
                names: ['Electronics'],
                slugs: ['electronics'],
                fullPath: 'electronics',
              },
            },
          ],
          categoryPaths: ['electronics'],
        },
      ]

      mockProductRepository.findByCategoryPath.mockResolvedValue(mockProducts)
      mockRequest.params = { path: 'electronics/computers/laptops' }

      await handler.getByCategoryPath(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.findByCategoryPath).toHaveBeenCalledWith([
        'electronics',
        'computers',
        'laptops',
      ])
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts)
    })

    it('should return 400 for invalid path', async () => {
      mockRequest.params = { path: '' }

      await handler.getByCategoryPath(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid path parameter',
        message: 'Path must be a valid string',
      })
    })
  })

  describe('search', () => {
    it('should return products by search query', async () => {
      const mockProducts: ProductWithCategories[] = [
        {
          id: '1',
          name: 'MacBook Pro',
          slug: 'macbook-pro',
          description: 'Powerful laptop',
          price: 1999.99,
          imageUrl: 'https://example.com/macbook.jpg',
          categoryIds: ['1'],
          createdAt: new Date(),
          updatedAt: new Date(),
          categories: [
            {
              id: '1',
              name: 'Electronics',
              slug: 'electronics',
              path: {
                ids: ['1'],
                names: ['Electronics'],
                slugs: ['electronics'],
                fullPath: 'electronics',
              },
            },
          ],
          categoryPaths: ['electronics'],
        },
      ]

      mockProductRepository.searchByFuzzyMatch.mockResolvedValue(mockProducts)
      mockRequest.query = { q: 'macbook' }

      await handler.search(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockProductRepository.searchByFuzzyMatch).toHaveBeenCalledWith('macbook')
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts)
    })

    it('should return 400 for missing query parameter', async () => {
      mockRequest.query = {}

      await handler.search(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing query parameter',
        message: 'Query parameter "q" is required and must be a string',
      })
    })

    it('should return 400 for empty query', async () => {
      mockRequest.query = { q: '   ' }

      await handler.search(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Empty query',
        message: 'Query parameter "q" cannot be empty',
      })
    })
  })
}) 