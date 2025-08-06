import { createCategoryRepository } from '../category.repository'
import { DatabaseAdapter } from '../../../adapters/database/database.adapter'
import { Category, CreateCategory, UpdateCategory } from '../category.types'

// Mock do DatabaseAdapter
const mockDatabaseAdapter = {
  findCategories: jest.fn(),
  findCategoryById: jest.fn(),
  findCategoryBySlug: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  countCategories: jest.fn(),
  findProducts: jest.fn(),
  findProductById: jest.fn(),
  findProductBySlug: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  countProducts: jest.fn(),
  transaction: jest.fn(),
  disconnect: jest.fn(),
} as jest.Mocked<DatabaseAdapter>

describe('CategoryRepository', () => {
  let categoryRepository: ReturnType<typeof createCategoryRepository>

  beforeEach(() => {
    jest.clearAllMocks()
    categoryRepository = createCategoryRepository(mockDatabaseAdapter)
  })

  describe('findAll', () => {
    it('should return all categories without filters', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Books',
          slug: 'books',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockDatabaseAdapter.findCategories.mockResolvedValue(mockCategories)

      const result = await categoryRepository.findAll()

      expect(mockDatabaseAdapter.findCategories).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: {},
        orderBy: { name: 'asc' },
      })
      expect(result).toEqual(mockCategories)
    })

    it('should return categories with filters', async () => {
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

      mockDatabaseAdapter.findCategories.mockResolvedValue(mockCategories)

      const result = await categoryRepository.findAll({
        limit: 10,
        offset: 0,
        search: 'electronics',
        parentId: null,
      })

      expect(mockDatabaseAdapter.findCategories).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          parentId: null,
          OR: [
            { name: { contains: 'electronics', mode: 'insensitive' } },
            { slug: { contains: 'electronics', mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      })
      expect(result).toEqual(mockCategories)
    })
  })

  describe('findById', () => {
    it('should return category by id', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDatabaseAdapter.findCategoryById.mockResolvedValue(mockCategory)

      const result = await categoryRepository.findById('1')

      expect(mockDatabaseAdapter.findCategoryById).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockCategory)
    })

    it('should return null when category not found', async () => {
      mockDatabaseAdapter.findCategoryById.mockResolvedValue(null)

      const result = await categoryRepository.findById('999')

      expect(mockDatabaseAdapter.findCategoryById).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  describe('findBySlug', () => {
    it('should return category by slug', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDatabaseAdapter.findCategoryBySlug.mockResolvedValue(mockCategory)

      const result = await categoryRepository.findBySlug('electronics')

      expect(mockDatabaseAdapter.findCategoryBySlug).toHaveBeenCalledWith('electronics')
      expect(result).toEqual(mockCategory)
    })

    it('should return null when category not found', async () => {
      mockDatabaseAdapter.findCategoryBySlug.mockResolvedValue(null)

      const result = await categoryRepository.findBySlug('non-existent')

      expect(mockDatabaseAdapter.findCategoryBySlug).toHaveBeenCalledWith('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new category', async () => {
      const createData: CreateCategory = {
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      }

      const mockCreatedCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDatabaseAdapter.createCategory.mockResolvedValue(mockCreatedCategory)

      const result = await categoryRepository.create(createData)

      expect(mockDatabaseAdapter.createCategory).toHaveBeenCalledWith(createData)
      expect(result).toEqual(mockCreatedCategory)
    })
  })

  describe('update', () => {
    it('should update an existing category', async () => {
      const updateData: UpdateCategory = {
        name: 'Updated Electronics',
      }

      const mockUpdatedCategory: Category = {
        id: '1',
        name: 'Updated Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDatabaseAdapter.updateCategory.mockResolvedValue(mockUpdatedCategory)

      const result = await categoryRepository.update('1', updateData)

      expect(mockDatabaseAdapter.updateCategory).toHaveBeenCalledWith('1', updateData)
      expect(result).toEqual(mockUpdatedCategory)
    })

    it('should return null when category not found', async () => {
      const updateData: UpdateCategory = {
        name: 'Updated Electronics',
      }

      mockDatabaseAdapter.updateCategory.mockResolvedValue(null as any)

      const result = await categoryRepository.update('999', updateData)

      expect(mockDatabaseAdapter.updateCategory).toHaveBeenCalledWith('999', updateData)
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete an existing category', async () => {
      const mockDeletedCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDatabaseAdapter.deleteCategory.mockResolvedValue(mockDeletedCategory)

      const result = await categoryRepository.delete('1')

      expect(mockDatabaseAdapter.deleteCategory).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockDeletedCategory)
    })

    it('should return null when category not found', async () => {
      mockDatabaseAdapter.deleteCategory.mockResolvedValue(null as any)

      const result = await categoryRepository.delete('999')

      expect(mockDatabaseAdapter.deleteCategory).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  describe('count', () => {
    it('should return total count of categories', async () => {
      mockDatabaseAdapter.countCategories.mockResolvedValue(5)

      const result = await categoryRepository.count()

      expect(mockDatabaseAdapter.countCategories).toHaveBeenCalledWith()
      expect(result).toBe(5)
    })
  })

  describe('getChildren', () => {
    it('should return children categories', async () => {
      const mockChildren: Category[] = [
        {
          id: '2',
          name: 'Laptops',
          slug: 'laptops',
          parentId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockDatabaseAdapter.findCategories.mockResolvedValue(mockChildren)

      const result = await categoryRepository.getChildren('1')

      expect(mockDatabaseAdapter.findCategories).toHaveBeenCalledWith({
        where: { parentId: '1' },
        orderBy: { name: 'asc' },
      })
      expect(result).toEqual(mockChildren)
    })
  })

  describe('buildCategoryPath', () => {
    it('should build category path correctly', async () => {
      const mockCategories = [
        {
          id: '3',
          name: 'Laptops',
          slug: 'laptops',
          parentId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Computers',
          slug: 'computers',
          parentId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockDatabaseAdapter.findCategoryById
        .mockResolvedValueOnce(mockCategories[0]) // laptops
        .mockResolvedValueOnce(mockCategories[1]) // computers
        .mockResolvedValueOnce(mockCategories[2]) // electronics
        .mockResolvedValueOnce(null) // end of path

      const result = await categoryRepository.buildCategoryPath('3')

      expect(result).toEqual({
        ids: ['1', '2', '3'],
        names: ['Electronics', 'Computers', 'Laptops'],
        slugs: ['electronics', 'computers', 'laptops'],
        fullPath: 'electronics/computers/laptops',
      })
    })

    it('should handle category with no parent', async () => {
      const mockCategory = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Reset the mock to ensure clean state
      mockDatabaseAdapter.findCategoryById.mockReset()
      
      mockDatabaseAdapter.findCategoryById
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(null)

      const result = await categoryRepository.buildCategoryPath('1')

      expect(result).toEqual({
        ids: ['1'],
        names: ['Electronics'],
        slugs: ['electronics'],
        fullPath: 'electronics',
      })
    })
  })
}) 