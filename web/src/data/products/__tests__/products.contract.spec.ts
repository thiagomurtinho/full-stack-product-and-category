import { 
  productSchema, 
  createProductSchema, 
  updateProductSchema, 
  productWithCategoriesSchema 
} from '../products.contract'

describe('Products Contracts', () => {
  describe('productSchema', () => {
    it('should validate valid product', () => {
      const validProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = productSchema.parse(validProduct)
      expect(result).toEqual(validProduct)
    })

    it('should reject invalid UUID', () => {
      const invalidProduct = {
        id: 'invalid-uuid',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => productSchema.parse(invalidProduct)).toThrow()
    })

    it('should reject invalid slug format', () => {
      const invalidProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iPhone-15', // Invalid: uppercase
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => productSchema.parse(invalidProduct)).toThrow()
    })

    it('should reject negative price', () => {
      const invalidProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: -999.99, // Invalid: negative price
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => productSchema.parse(invalidProduct)).toThrow()
    })

    it('should reject invalid image URL', () => {
      const invalidProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'invalid-url', // Invalid: not a URL
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => productSchema.parse(invalidProduct)).toThrow()
    })

    it('should allow null imageUrl', () => {
      const validProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: null,
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = productSchema.parse(validProduct)
      expect(result).toEqual(validProduct)
    })
  })

  describe('createProductSchema', () => {
    it('should validate valid create product data', () => {
      const validCreateData = {
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
      }

      const result = createProductSchema.parse(validCreateData)
      expect(result).toEqual(validCreateData)
    })

    it('should not require optional fields', () => {
      const validCreateData = {
        name: 'iPhone 15',
        slug: 'iphone-15',
        price: 999.99,
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
      }

      const result = createProductSchema.parse(validCreateData)
      expect(result).toEqual(validCreateData)
    })

    it('should reject missing required fields', () => {
      const invalidCreateData = {
        name: 'iPhone 15',
        // missing slug, price, categoryIds
      }

      expect(() => createProductSchema.parse(invalidCreateData)).toThrow()
    })
  })

  describe('updateProductSchema', () => {
    it('should validate partial update data', () => {
      const validUpdateData = {
        name: 'iPhone 15 Pro',
        price: 1199.99,
      }

      const result = updateProductSchema.parse(validUpdateData)
      expect(result).toEqual(validUpdateData)
    })

    it('should allow empty object', () => {
      const emptyUpdateData = {}

      const result = updateProductSchema.parse(emptyUpdateData)
      expect(result).toEqual(emptyUpdateData)
    })
  })

  describe('productWithCategoriesSchema', () => {
    it('should validate product with categories', () => {
      const validProductWithCategories = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Electronics',
            slug: 'electronics',
            path: {
              ids: ['123e4567-e89b-12d3-a456-426614174001'],
              names: ['Electronics'],
              slugs: ['electronics'],
              fullPath: 'electronics',
            },
          },
        ],
        categoryPaths: ['electronics'],
      }

      const result = productWithCategoriesSchema.parse(validProductWithCategories)
      expect(result).toEqual(validProductWithCategories)
    })

    it('should validate product without categories', () => {
      const validProductWithoutCategories = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest iPhone model',
        price: 999.99,
        imageUrl: 'https://example.com/iphone.jpg',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [],
        categoryPaths: [],
      }

      const result = productWithCategoriesSchema.parse(validProductWithoutCategories)
      expect(result).toEqual(validProductWithoutCategories)
    })
  })
}) 