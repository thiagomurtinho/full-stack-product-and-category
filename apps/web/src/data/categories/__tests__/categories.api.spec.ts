import { categoriesApi } from '../categories.api'
import { Category, CreateCategory, UpdateCategory } from '../categories.types'

// Mock the shared API
jest.mock('../../shared/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('../../shared/error-handling', () => ({
  validateApiResponse: jest.fn((data) => data),
  safeValidateApiResponse: jest.fn((data) => data),
}))

import { api } from '../../shared/api'
import { validateApiResponse } from '../../shared/error-handling'

const mockApi = api as jest.Mocked<typeof api>
const mockValidateApiResponse = validateApiResponse as jest.MockedFunction<typeof validateApiResponse>

describe('Categories API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all categories without params', async () => {
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
      
      mockApi.get.mockResolvedValueOnce(mockCategories)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.getAll()

      expect(mockApi.get).toHaveBeenCalledWith('/categories')
      expect(result).toEqual(mockCategories)
    })

    it('should fetch categories with pagination params', async () => {
      const mockCategories: Category[] = []
      const params = { skip: 10, take: 5 }
      
      mockApi.get.mockResolvedValueOnce(mockCategories)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.getAll(params)

      expect(mockApi.get).toHaveBeenCalledWith('/categories?skip=10&take=5')
      expect(result).toEqual(mockCategories)
    })
  })

  describe('getById', () => {
    it('should fetch category by id', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.get.mockResolvedValueOnce(mockCategory)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.getById('1')

      expect(mockApi.get).toHaveBeenCalledWith('/categories/1')
      expect(result).toEqual(mockCategory)
    })
  })

  describe('getWithPath', () => {
    it('should fetch category with path', async () => {
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
      
      mockApi.get.mockResolvedValueOnce(mockCategoryWithPath)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.getWithPath('1')

      expect(mockApi.get).toHaveBeenCalledWith('/categories/1/path')
      expect(result).toEqual(mockCategoryWithPath)
    })
  })

  describe('create', () => {
    it('should create new category', async () => {
      const createData: CreateCategory = {
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      }
      
      const createdCategory: Category = {
        id: '1',
        name: createData.name,
        slug: createData.slug,
        parentId: createData.parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.post.mockResolvedValueOnce(createdCategory)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.create(createData)

      expect(mockApi.post).toHaveBeenCalledWith('/categories', createData)
      expect(result).toEqual(createdCategory)
    })
  })

  describe('update', () => {
    it('should update category', async () => {
      const updateData: UpdateCategory = {
        name: 'Updated Electronics',
      }
      
      const updatedCategory: Category = {
        id: '1',
        name: 'Updated Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.put.mockResolvedValueOnce(updatedCategory)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.update('1', updateData)

      expect(mockApi.put).toHaveBeenCalledWith('/categories/1', updateData)
      expect(result).toEqual(updatedCategory)
    })
  })

  describe('delete', () => {
    it('should delete category', async () => {
      const deletedCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockApi.delete.mockResolvedValueOnce(deletedCategory)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.delete('1')

      expect(mockApi.delete).toHaveBeenCalledWith('/categories/1')
      expect(result).toEqual(deletedCategory)
    })
  })

  describe('count', () => {
    it('should get categories count', async () => {
      const countResponse = { count: 5 }
      
      mockApi.get.mockResolvedValueOnce(countResponse)
      mockValidateApiResponse.mockImplementation((data) => data)

      const result = await categoriesApi.count()

      expect(mockApi.get).toHaveBeenCalledWith('/categories/count')
      expect(result).toEqual(countResponse)
    })
  })
}) 