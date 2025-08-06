import { createProductRepository } from '../product.repository'
import { DatabaseAdapter } from '../../../adapters/database/database.adapter'
import { CreateProduct, UpdateProduct, ProductWithCategories } from '../product.types'

// Mock do DatabaseAdapter
const mockDatabaseAdapter = {
  findProducts: jest.fn(),
  findProductById: jest.fn(),
  findProductBySlug: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  countProducts: jest.fn(),
  findCategoryById: jest.fn(),
  findCategories: jest.fn(),
  findCategoryBySlug: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  countCategories: jest.fn(),
  transaction: jest.fn(),
  disconnect: jest.fn(),
} as jest.Mocked<DatabaseAdapter>

describe('ProductRepository', () => {
  let productRepository: ReturnType<typeof createProductRepository>

  beforeEach(() => {
    jest.clearAllMocks()
    productRepository = createProductRepository(mockDatabaseAdapter)
  })

  describe('findAll', () => {
    it('should return all products without filters', async () => {
      const mockProducts = [
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
              parent: null,
            },
          ],
        },
      ]

      mockDatabaseAdapter.findProducts.mockResolvedValue(mockProducts)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.findAll()

      expect(mockDatabaseAdapter.findProducts).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {},
        orderBy: { name: 'asc' },
        include: {
          categories: {
            include: {
              parent: true,
            },
          },
        },
      })
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toHaveProperty('categoryPaths')
    })

    it('should return products with filters', async () => {
      const mockProducts = [
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
              parent: null,
            },
          ],
        },
      ]

      mockDatabaseAdapter.findProducts.mockResolvedValue(mockProducts)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.findAll({
        limit: 10,
        offset: 0,
        search: 'macbook',
        categoryIds: ['1'],
        minPrice: 1000,
        maxPrice: 2000,
        orderBy: 'price',
        orderDirection: 'asc',
      })

      expect(mockDatabaseAdapter.findProducts).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { name: { contains: 'macbook', mode: 'insensitive' } },
            { description: { contains: 'macbook', mode: 'insensitive' } },
          ],
          price: {
            gte: 1000,
            lte: 2000,
          },
          categories: {
            some: { id: { in: ['1'] } },
          },
        },
        orderBy: { price: 'asc' },
        include: {
          categories: {
            include: {
              parent: true,
            },
          },
        },
      })
      expect(result.data).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('should return product by id', async () => {
      const mockProduct = {
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
            parent: null,
          },
        ],
      }

      mockDatabaseAdapter.findProductById.mockResolvedValue(mockProduct as any)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.findById('1')

      expect(mockDatabaseAdapter.findProductById).toHaveBeenCalledWith('1', {
        categories: {
          include: {
            parent: true,
          },
        },
      })
      expect(result).toBeDefined()
      expect(result).toHaveProperty('categoryPaths')
    })

    it('should return null when product not found', async () => {
      mockDatabaseAdapter.findProductById.mockResolvedValue(null)

      const result = await productRepository.findById('999')

      expect(mockDatabaseAdapter.findProductById).toHaveBeenCalledWith('999', {
        categories: {
          include: {
            parent: true,
          },
        },
      })
      expect(result).toBeNull()
    })
  })

  describe('findBySlug', () => {
    it('should return product by slug', async () => {
      const mockProduct = {
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
            parent: null,
          },
        ],
      }

      mockDatabaseAdapter.findProductBySlug.mockResolvedValue(mockProduct as any)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.findBySlug('macbook-pro')

      expect(mockDatabaseAdapter.findProductBySlug).toHaveBeenCalledWith('macbook-pro', {
        categories: {
          include: {
            parent: true,
          },
        },
      })
      expect(result).toBeDefined()
      expect(result).toHaveProperty('categoryPaths')
    })

    it('should return null when product not found', async () => {
      mockDatabaseAdapter.findProductBySlug.mockResolvedValue(null)

      const result = await productRepository.findBySlug('non-existent')

      expect(mockDatabaseAdapter.findProductBySlug).toHaveBeenCalledWith('non-existent', {
        categories: {
          include: {
            parent: true,
          },
        },
      })
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new product', async () => {
      const createData: CreateProduct = {
        name: 'MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 1999.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryIds: ['1'],
      }

      const mockCreatedProduct = {
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
            parent: null,
          },
        ],
      }

      mockDatabaseAdapter.createProduct.mockResolvedValue(mockCreatedProduct as any)
      mockDatabaseAdapter.findProductById.mockResolvedValue(mockCreatedProduct as any)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.create(createData)

      expect(mockDatabaseAdapter.createProduct).toHaveBeenCalledWith({
        name: 'MacBook Pro',
        slug: 'macbook-pro',
        description: 'Powerful laptop',
        price: 1999.99,
        imageUrl: 'https://example.com/macbook.jpg',
        categories: {
          connect: [{ id: '1' }],
        },
      })
      expect(result).toBeDefined()
      expect(result).toHaveProperty('categoryPaths')
    })
  })

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateData: UpdateProduct = {
        name: 'Updated MacBook Pro',
        price: 2499.99,
      }

      const mockUpdatedProduct = {
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
            parent: null,
          },
        ],
      }

      mockDatabaseAdapter.updateProduct.mockResolvedValue(mockUpdatedProduct as any)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.update('1', updateData)

      expect(mockDatabaseAdapter.updateProduct).toHaveBeenCalledWith('1', updateData)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('categoryPaths')
    })

    it('should return null when product not found', async () => {
      const updateData: UpdateProduct = {
        name: 'Updated MacBook Pro',
      }

      mockDatabaseAdapter.updateProduct.mockResolvedValue(null as any)

      const result = await productRepository.update('999', updateData)

      expect(mockDatabaseAdapter.updateProduct).toHaveBeenCalledWith('999', updateData)
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const mockDeletedProduct = {
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
            parent: null,
          },
        ],
      }

      mockDatabaseAdapter.deleteProduct.mockResolvedValue(mockDeletedProduct as any)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.delete('1')

      expect(mockDatabaseAdapter.deleteProduct).toHaveBeenCalledWith('1')
      expect(result).toBeDefined()
      expect(result).toHaveProperty('categoryPaths')
    })

    it('should return null when product not found', async () => {
      mockDatabaseAdapter.deleteProduct.mockResolvedValue(null as any)

      const result = await productRepository.delete('999')

      expect(mockDatabaseAdapter.deleteProduct).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  describe('count', () => {
    it('should return total count of products', async () => {
      mockDatabaseAdapter.countProducts.mockResolvedValue(10)

      const result = await productRepository.count()

      expect(mockDatabaseAdapter.countProducts).toHaveBeenCalledWith()
      expect(result).toBe(10)
    })
  })

  describe('findByCategoryPath', () => {
    it('should return products by category path', async () => {
      const mockProducts = [
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
              parent: null,
            },
          ],
        },
      ]

      mockDatabaseAdapter.findProducts.mockResolvedValue(mockProducts)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.findByCategoryPath(['electronics'])

      expect(mockDatabaseAdapter.findProducts).toHaveBeenCalledWith({
        where: {
          categories: {
            some: {
              slug: { in: ['electronics'] },
            },
          },
        },
        include: {
          categories: {
            include: {
              parent: true,
            },
          },
        },
      })
      expect(result).toHaveLength(1)
    })
  })

  describe('searchByFuzzyMatch', () => {
    it('should return products by fuzzy search', async () => {
      const mockProducts = [
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
              parent: null,
            },
          ],
        },
      ]

      mockDatabaseAdapter.findProducts.mockResolvedValue(mockProducts)
      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.searchByFuzzyMatch('macbook')

      expect(mockDatabaseAdapter.findProducts).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'macbook' } },
            { description: { contains: 'macbook' } },
            { slug: { contains: 'macbook' } },
          ],
        },
        include: {
          categories: {
            include: {
              parent: true,
            },
          },
        },
      })
      expect(result).toHaveLength(1)
    })
  })

  describe('enrichProductWithPaths', () => {
    it('should enrich product with category paths', async () => {
      const mockProduct = {
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
            parent: null,
          },
        ],
      }

      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.enrichProductWithPaths(mockProduct)

      expect(result).toHaveProperty('categoryPaths')
      expect(result.categoryPaths).toEqual(['electronics'])
      expect(result.categories[0]).toHaveProperty('path')
    })
  })

  describe('enrichProductsWithPaths', () => {
    it('should enrich multiple products with category paths', async () => {
      const mockProducts = [
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
              parent: null,
            },
          ],
        },
      ]

      mockDatabaseAdapter.findCategoryById.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await productRepository.enrichProductsWithPaths(mockProducts)

      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('categoryPaths')
      expect(result[0].categoryPaths).toEqual(['electronics'])
    })
  })
}) 