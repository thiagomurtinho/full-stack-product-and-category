import { isApiError, parseApiError, validateApiResponse } from '../error-handling'
import { z } from 'zod'

describe('Error Handling', () => {
  describe('isApiError', () => {
    it('should return true for API errors', () => {
      const apiError = new Error('API Error') as any
      apiError.status = 404
      
      expect(isApiError(apiError)).toBe(true)
    })

    it('should return false for regular errors', () => {
      const regularError = new Error('Regular error')
      
      expect(isApiError(regularError)).toBe(false)
    })

    it('should return false for non-error objects', () => {
      expect(isApiError({ message: 'test' })).toBe(false)
      expect(isApiError(null)).toBe(false)
      expect(isApiError(undefined)).toBe(false)
    })
  })

  describe('parseApiError', () => {
    it('should return API error as is', () => {
      const apiError = new Error('API Error') as any
      apiError.status = 404
      
      const result = parseApiError(apiError)
      
      expect(result).toEqual({
        message: 'API Error',
        status: 404,
      })
    })

    it('should convert regular error to API error', () => {
      const regularError = new Error('Regular error')
      
      const result = parseApiError(regularError)
      
      expect(result).toEqual({
        message: 'Regular error',
        status: 500,
      })
    })

    it('should handle unknown errors', () => {
      const result = parseApiError('string error')
      
      expect(result).toEqual({
        message: 'Unknown error occurred',
        status: 500,
      })
    })
  })

  describe('validateApiResponse', () => {
    it('should validate correct data', () => {
      const schema = z.object({
        id: z.string(),
        name: z.string(),
      })
      
      const data = { id: '1', name: 'test' }
      
      const result = validateApiResponse(data, schema)
      
      expect(result).toEqual(data)
    })

    it('should throw error for invalid data', () => {
      const schema = z.object({
        id: z.string(),
        name: z.string(),
      })
      
      const data = { id: '1' } // missing name
      
      expect(() => validateApiResponse(data, schema, { strict: true })).toThrow('API response validation failed: name: Invalid input: expected string, received undefined')
    })
  })
}) 