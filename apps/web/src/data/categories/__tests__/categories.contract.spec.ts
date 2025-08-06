import { 
  categorySchema, 
  apiCategorySchema,
  createCategorySchema, 
  updateCategorySchema, 
  categoryWithPathSchema 
} from '../categories.contract'

describe('Categories Contracts', () => {
  describe('categorySchema', () => {
    it('should validate valid category', () => {
      const validCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = categorySchema.parse(validCategory)
      expect(result).toEqual(validCategory)
    })

    it('should reject invalid UUID', () => {
      const invalidCategory = {
        id: 'invalid-uuid',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => categorySchema.parse(invalidCategory)).toThrow()
    })

    it('should reject invalid slug format', () => {
      const invalidCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Electronics',
        slug: 'Electronics', // Invalid: uppercase
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => categorySchema.parse(invalidCategory)).toThrow()
    })

    it('should reject empty name', () => {
      const invalidCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: '',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(() => categorySchema.parse(invalidCategory)).toThrow()
    })
  })

  describe('apiCategorySchema', () => {
    it('should validate category with string dates from API', () => {
      const validCategoryFromApi = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      }

      const result = apiCategorySchema.parse(validCategoryFromApi)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('should reject invalid date string', () => {
      const invalidCategoryFromApi = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: 'invalid-date',
        updatedAt: '2024-01-15T10:30:00.000Z',
      }

      expect(() => apiCategorySchema.parse(invalidCategoryFromApi)).toThrow()
    })
  })

  describe('createCategorySchema', () => {
    it('should validate valid create category data', () => {
      const validCreateData = {
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      }

      const result = createCategorySchema.parse(validCreateData)
      expect(result).toEqual(validCreateData)
    })

    it('should not require parentId', () => {
      const validCreateData = {
        name: 'Electronics',
        slug: 'electronics',
      }

      const result = createCategorySchema.parse(validCreateData)
      expect(result).toEqual(validCreateData)
    })

    it('should reject missing required fields', () => {
      const invalidCreateData = {
        name: 'Electronics',
        // missing slug
      }

      expect(() => createCategorySchema.parse(invalidCreateData)).toThrow()
    })
  })

  describe('updateCategorySchema', () => {
    it('should validate partial update data', () => {
      const validUpdateData = {
        name: 'Updated Electronics',
      }

      const result = updateCategorySchema.parse(validUpdateData)
      expect(result).toEqual(validUpdateData)
    })

    it('should allow empty object', () => {
      const emptyUpdateData = {}

      const result = updateCategorySchema.parse(emptyUpdateData)
      expect(result).toEqual(emptyUpdateData)
    })
  })

  describe('categoryWithPathSchema', () => {
    it('should validate category with path', () => {
      const validCategoryWithPath = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        path: {
          ids: ['123e4567-e89b-12d3-a456-426614174000'],
          names: ['Electronics'],
          slugs: ['electronics'],
          fullPath: 'electronics',
        },
        children: [],
      }

      const result = categoryWithPathSchema.parse(validCategoryWithPath)
      expect(result).toEqual(validCategoryWithPath)
    })

    it('should validate category without path', () => {
      const validCategoryWithoutPath = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = categoryWithPathSchema.parse(validCategoryWithoutPath)
      expect(result).toEqual(validCategoryWithoutPath)
    })
  })
}) 