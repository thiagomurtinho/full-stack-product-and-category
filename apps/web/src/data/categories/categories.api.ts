import { z } from 'zod'
import { api } from '../shared/api'
import { Category, CreateCategory, UpdateCategory, CategoryWithPath } from './categories.types'
import { 
  categorySchema, 
  apiCategorySchema,
  createCategorySchema, 
  updateCategorySchema, 
  categoryWithPathSchema,
  apiCategoryWithPathSchema 
} from './categories.contract'
import { validateApiResponse, safeValidateApiResponse } from '../shared/error-handling'

/**
 * Categories API client for managing category operations.
 * Provides methods to interact with the backend categories endpoints.
 */
export const categoriesApi = {
  /**
   * Fetches all categories from the API.
   * @param {Object} params - Optional pagination parameters
   * @param {number} params.skip - Number of items to skip (for pagination)
   * @param {number} params.take - Number of items to take (for pagination)
   * @returns {Promise<Category[]>} Array of categories
   */
  getAll: async (params?: { skip?: number; take?: number }): Promise<Category[]> => {
    const queryParams = params ? `?${new URLSearchParams(params as any)}` : ''
    const [data, error] = await api.get<any[]>(`/categories${queryParams}`)
    
    if (error) {
      throw error
    }
    
    return data?.map(item => safeValidateApiResponse(item, apiCategorySchema, 'categories.getAll')) || []
  },

  /**
   * Fetches a category by its ID.
   * @param {string} id - The category ID
   * @returns {Promise<Category>} The category data
   */
  getById: async (id: string): Promise<Category> => {
    const [data, error] = await api.get<any>(`/categories/${id}`)
    
    if (error) {
      throw error
    }
    
    return safeValidateApiResponse(data, apiCategorySchema, 'categories.getById')
  },

  /**
   * Fetches a category with its full hierarchical path.
   * @param {string} id - The category ID
   * @returns {Promise<CategoryWithPath>} The category with path information
   */
  getWithPath: async (id: string): Promise<CategoryWithPath> => {
    const [data, error] = await api.get<any>(`/categories/${id}/path`)
    
    if (error) {
      throw error
    }
    
    return safeValidateApiResponse(data, apiCategoryWithPathSchema, 'categories.getWithPath')
  },

  /**
   * Creates a new category.
   * @param {CreateCategory} data - The category data to create
   * @returns {Promise<Category>} The created category
   */
  create: async (data: CreateCategory): Promise<Category> => {
    // Validate input data in strict mode
    const validatedData = validateApiResponse(data, createCategorySchema, { 
      strict: true, 
      context: 'categories.create input' 
    })
    const [response, error] = await api.post<any>('/categories', validatedData)
    
    // if (error) {
    //   throw error
    // }
    
    return safeValidateApiResponse(response, apiCategorySchema, 'categories.create response')
  },

  /**
   * Updates an existing category.
   * @param {string} id - The category ID to update
   * @param {UpdateCategory} data - The category data to update
   * @returns {Promise<Category>} The updated category
   */
  update: async (id: string, data: UpdateCategory): Promise<Category> => {
    // Validate input data in strict mode
    const validatedData = validateApiResponse(data, updateCategorySchema, { 
      strict: true, 
      context: 'categories.update input' 
    })
    const [response, error] = await api.put<any>(`/categories/${id}`, validatedData)
    
    // if (error) {
    //   throw error
    // }
    
    return safeValidateApiResponse(response, apiCategorySchema, 'categories.update response')
  },

  /**
   * Deletes a category by its ID.
   * @param {string} id - The category ID to delete
   * @returns {Promise<Category>} The deleted category
   */
  delete: async (id: string): Promise<Category> => {
    const [response, error] = await api.delete<any>(`/categories/${id}`)
    
    if (error) {
      throw error
    }
    
    return safeValidateApiResponse(response, apiCategorySchema, 'categories.delete')
  },

  /**
   * Gets the total count of categories.
   * @returns {Promise<{count: number}>} Object containing the total count
   */
  count: async (): Promise<{ count: number }> => {
    const [data, error] = await api.get<any>('/categories/count')
    
    // if (error) {
    //   throw error
    // }
    
    return safeValidateApiResponse(data, z.object({ count: z.number() }), 'categories.count')
  },
} 