import { validateApiResponse, safeValidateApiResponse } from '../error-handling'
import { apiBaseEntitySchema } from '../validation'
import { apiCategorySchema } from '../../categories/categories.contract'
import { apiProductWithCategoriesSchema } from '../../products/products.contract'
import { z } from 'zod'

describe('Validation Integration Tests', () => {
  describe('validateApiResponse with new safe features', () => {
    it('should validate correct data in strict mode', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      
      const result = validateApiResponse(data, apiBaseEntitySchema, { strict: true })
      
      expect((result as any).id).toBe(data.id)
      expect((result as any).createdAt).toBeInstanceOf(Date)
      expect((result as any).updatedAt).toBeInstanceOf(Date)
    })

    it('should handle invalid data gracefully in non-strict mode', () => {
      const data = {
        id: 'invalid-uuid',
        createdAt: 'invalid-date',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      
      // Mock console.warn to verify logging
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const result = validateApiResponse(data, apiBaseEntitySchema, { strict: false })
      
      expect(result).toBe(data) // Should return original data
      expect(consoleWarnSpy).toHaveBeenCalled()
      
      consoleWarnSpy.mockRestore()
    })

    it('should throw in strict mode with invalid data', () => {
      const data = {
        id: 'invalid-uuid',
        createdAt: 'invalid-date',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      
      expect(() => 
        validateApiResponse(data, apiBaseEntitySchema, { strict: true })
      ).toThrow('validation failed')
    })
  })

  describe('safeValidateApiResponse', () => {
    it('should never throw and always return data', () => {
      const data = { invalid: 'data' }
      
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const result = safeValidateApiResponse(data, apiBaseEntitySchema, 'test context')
      
      expect(result).toBe(data)
      expect(consoleWarnSpy).toHaveBeenCalled()
      
      consoleWarnSpy.mockRestore()
    })
  })

  describe('Schema compatibility tests', () => {
    it('should handle API category response format', () => {
      const mockCategoryResponse = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        name: 'Test Category',
        slug: 'test-category',
        parentId: null
      }
      
      const result = validateApiResponse(mockCategoryResponse, apiCategorySchema)
      
      expect((result as any).name).toBe('Test Category')
      expect((result as any).createdAt).toBeInstanceOf(Date)
    })

    it('should handle API product with categories response format', () => {
      const mockProductResponse = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
        categoryIds: ['456e7890-e89b-12d3-a456-426614174000'],
        categories: [{
          id: '456e7890-e89b-12d3-a456-426614174000',
          name: 'Test Category',
          slug: 'test-category',
          parentId: null
        }],
        categoryPaths: ['/test-category']
      }
      
      const result = validateApiResponse(mockProductResponse, apiProductWithCategoriesSchema)
      
      expect((result as any).name).toBe('Test Product')
      expect((result as any).price).toBe(99.99)
      expect((result as any).categories).toHaveLength(1)
      expect((result as any).categoryPaths).toContain('/test-category')
    })
  })

  describe('Date handling tests', () => {
    it('should convert ISO date strings to Date objects', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T10:30:00.000Z',
        updatedAt: '2023-06-15T14:45:30.500Z'
      }
      
      const result = validateApiResponse(data, apiBaseEntitySchema)
      
      expect((result as any).createdAt).toBeInstanceOf(Date)
      expect((result as any).updatedAt).toBeInstanceOf(Date)
      expect((result as any).createdAt.getTime()).toBe(new Date('2023-01-01T10:30:00.000Z').getTime())
      expect((result as any).updatedAt.getTime()).toBe(new Date('2023-06-15T14:45:30.500Z').getTime())
    })

    it('should handle already converted Date objects', () => {
      const now = new Date()
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: now,
        updatedAt: now
      }
      
      const result = validateApiResponse(data, apiBaseEntitySchema)
      
      expect((result as any).createdAt).toBeInstanceOf(Date)
      expect((result as any).updatedAt).toBeInstanceOf(Date)
      expect((result as any).createdAt).toBe(now)
      expect((result as any).updatedAt).toBe(now)
    })
  })
})
