import { productsApi } from '../products.api'
import { Product, CreateProduct, UpdateProduct } from '../products.types'

// Mock the API module
jest.mock('../../shared/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

// Mock the error handling module
jest.mock('../../shared/error-handling', () => ({
  validateApiResponse: jest.fn(),
  safeValidateApiResponse: jest.fn((data) => data),
}))

import { api } from '../../shared/api'
import { validateApiResponse, safeValidateApiResponse } from '../../shared/error-handling'

const mockApi = api as jest.Mocked<typeof api>
const mockValidateApiResponse = validateApiResponse as jest.MockedFunction<typeof validateApiResponse>
const mockSafeValidateApiResponse = safeValidateApiResponse as jest.MockedFunction<typeof safeValidateApiResponse>

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all products', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'iPhone 15',
          slug: 'iphone-15',
          description: 'Latest iPhone model',
          price: 999.99,
          imageUrl: 'https://example.com/iphone.jpg',
          categoryIds: ['1'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      
      mockApi.get.mockResolvedValueOnce(mockProducts)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.getAll()

      expect(mockApi.get).toHaveBeenCalledWith('/products')
      expect(result).toEqual(mockProducts)
    })

    it('should fetch products with params', async () => {
      const mockProducts: Product[] = []
      const params = { limit: 10, offset: 0 }
      
      mockApi.get.mockResolvedValueOnce(mockProducts)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.getAll(params)

      expect(mockApi.get).toHaveBeenCalledWith('/products?limit=10&offset=0')
      expect(result).toEqual(mockProducts)
    })
  })

  describe('getById', () => {
    it('should fetch product by id', async () => {
      const mockProduct: Product = {
        id: '1',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.get.mockResolvedValueOnce(mockProduct)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.getById('1')

      expect(mockApi.get).toHaveBeenCalledWith('/products/1')
      expect(result).toEqual(mockProduct)
    })
  })

  describe('getWithCategories', () => {
    it('should fetch product with categories', async () => {
      const mockProductWithCategories: Product = {
        id: '1',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.get.mockResolvedValueOnce(mockProductWithCategories)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.getWithCategories('1')

      expect(mockApi.get).toHaveBeenCalledWith('/products/1/with-categories')
      expect(result).toEqual(mockProductWithCategories)
    })
  })

  describe('create', () => {
    it('should create new product', async () => {
      const createData: CreateProduct = {
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['1'],
      }
      
      const createdProduct: Product = {
        id: '1',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.post.mockResolvedValueOnce(createdProduct)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.create(createData)

      expect(mockApi.post).toHaveBeenCalledWith('/products', createData)
      expect(result).toEqual(createdProduct)
    })
  })

  describe('update', () => {
    it('should update product', async () => {
      const updateData: UpdateProduct = {
        name: 'iPhone 15 Pro',
        price: 1199.99,
      }
      
      const updatedProduct: Product = {
        id: '1',
        name: 'iPhone 15 Pro',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 1199.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.put.mockResolvedValueOnce(updatedProduct)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.update('1', updateData)

      expect(mockApi.put).toHaveBeenCalledWith('/products/1', updateData)
      expect(result).toEqual(updatedProduct)
    })
  })

  describe('delete', () => {
    it('should delete product', async () => {
      mockApi.delete.mockResolvedValueOnce(undefined)

      await productsApi.delete('1')

      expect(mockApi.delete).toHaveBeenCalledWith('/products/1')
    })
  })

  describe('getCount', () => {
    it('should get products count', async () => {
      const countResponse = { count: 10 }
      
      mockApi.get.mockResolvedValueOnce(countResponse)
      mockValidateApiResponse.mockImplementation((data: unknown) => data)

      const result = await productsApi.getCount()

      expect(mockApi.get).toHaveBeenCalledWith('/products/count')
      expect(result).toEqual(countResponse)
    })
  })
}) 