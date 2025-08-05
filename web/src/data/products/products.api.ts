import { z } from 'zod'
import { api } from '../shared/api'
import { Product, CreateProduct, UpdateProduct, ProductCount, PaginatedProducts, ProductWithCategories } from './products.types'
import { 
  productSchema, 
  apiProductSchema,
  apiProductWithCategoriesSchema,
  createProductSchema, 
  updateProductSchema, 
  productWithCategoriesSchema 
} from './products.contract'
import { validateApiResponse, safeValidateApiResponse } from '../shared/error-handling'

/**
 * Products API client for managing product operations.
 * Provides methods to interact with the backend products endpoints.
 */
export const productsApi = {
  /**
   * Fetches all products from the API with pagination support.
   * @param {Object} params - Optional pagination and filter parameters
   * @param {number} params.limit - Maximum number of products to return
   * @param {number} params.offset - Number of products to skip (for pagination)
   * @param {string} params.search - Search term for filtering products
   * @param {string[]} params.categoryIds - Category IDs to filter by
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {string} params.orderBy - Field to order by (name, price, createdAt)
   * @param {string} params.orderDirection - Order direction (asc, desc)
   * @returns {Promise<PaginatedProducts>} Paginated products with metadata
   */
  getAll: async (params?: { 
    limit?: number; 
    offset?: number;
    search?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }): Promise<PaginatedProducts> => {
    // Filter out undefined and empty values
    const validParams: Record<string, any> = {}
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value) && value.length > 0) {
            validParams[key] = value.join(',')
          } else {
            validParams[key] = value
          }
        }
      })
    }
    
    const queryParams = Object.keys(validParams).length > 0 
      ? `?${new URLSearchParams(validParams)}` 
      : ''
    
    const response = await api.get<any>(`/products${queryParams}`)
    
    // Validate the response structure
    const paginatedProductsSchema = z.object({
      data: z.array(apiProductWithCategoriesSchema),
      pagination: z.object({
        total: z.number(),
        limit: z.number(),
        offset: z.number(),
        totalPages: z.number(),
        currentPage: z.number(),
        hasNext: z.boolean(),
        hasPrev: z.boolean()
      })
    })
    
    return safeValidateApiResponse(response, paginatedProductsSchema, 'products.getAll')
  },

  /**
   * Fetches a product by its ID.
   * @param {string} id - The product ID
   * @returns {Promise<ProductWithCategories>} The product data with categories
   */
  getById: async (id: string): Promise<ProductWithCategories> => {
    const data = await api.get<any>(`/products/${id}`)
    return safeValidateApiResponse(data, apiProductWithCategoriesSchema, 'products.getById')
  },

  /**
   * Fetches a product with its associated categories.
   * @param {string} id - The product ID
   * @returns {Promise<ProductWithCategories>} The product data with categories
   */
  getWithCategories: async (id: string): Promise<ProductWithCategories> => {
    const data = await api.get<any>(`/products/${id}/with-categories`)
    return safeValidateApiResponse(data, apiProductWithCategoriesSchema, 'products.getWithCategories')
  },

  /**
   * Fetches a product by its slug.
   * @param {string} slug - The product slug
   * @returns {Promise<ProductWithCategories>} The product data with categories
   */
  getBySlug: async (slug: string): Promise<ProductWithCategories> => {
    const data = await api.get<any>(`/products/slug/${slug}`)
    return safeValidateApiResponse(data, apiProductWithCategoriesSchema, 'products.getBySlug')
  },

  /**
   * Creates a new product.
   * 
   * @param {CreateProduct} product - The product data to create
   * @returns {Promise<Product>} The created product
   * @throws {Error} If the request fails
   */
  create: async (product: CreateProduct): Promise<Product> => {
    // Validate input data in strict mode
    const validatedData = validateApiResponse(product, createProductSchema, { 
      strict: true, 
      context: 'products.create input' 
    })
    const data = await api.post<any>('/products', validatedData)
    return safeValidateApiResponse(data, apiProductWithCategoriesSchema, 'products.create response')
  },

  /**
   * Updates an existing product.
   * 
   * @param {string} id - The product ID to update
   * @param {UpdateProduct} product - The product data to update
   * @returns {Promise<Product>} The updated product
   * @throws {Error} If the request fails
   */
  update: async (id: string, product: UpdateProduct): Promise<Product> => {
    // Validate input data in strict mode
    const validatedData = validateApiResponse(product, updateProductSchema, { 
      strict: true, 
      context: 'products.update input' 
    })
    const data = await api.put<any>(`/products/${id}`, validatedData)
    return safeValidateApiResponse(data, apiProductWithCategoriesSchema, 'products.update response')
  },

  /**
   * Deletes a product by its ID.
   * @param {string} id - The product ID to delete
   * @returns {Promise<void>} Resolves when deletion is complete
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },

  /**
   * Gets the total count of products.
   * @returns {Promise<ProductCount>} Object containing the total count
   */
  getCount: async (): Promise<ProductCount> => {
    const data = await api.get<any>('/products/count')
    return safeValidateApiResponse(data, z.object({ count: z.number() }), 'products.getCount')
  },
} 