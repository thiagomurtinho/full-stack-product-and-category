import { CategoryRepository } from './category.interface'
import { Category, CreateCategory, UpdateCategory, CategoryWithPath } from './category.types'
import { DatabaseAdapter } from '../../adapters/database/database.adapter'

/**
 * Repository for managing category-related operations.
 * Provides methods to interact with the database for CRUD operations and additional utilities.
 */
export const createCategoryRepository = (databaseAdapter: DatabaseAdapter): CategoryRepository => ({
  /**
   * Retrieves all categories based on the provided parameters.
   * @param {Object} params - Query parameters for filtering and pagination.
   * @returns {Promise<Category[]>} - A promise that resolves to a list of categories.
   */
  async findAll(params = {}) {
    const { limit, offset, search, parentId } = params
    
    const where: any = {}
    if (parentId !== undefined) {
      where.parentId = parentId
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    return databaseAdapter.findCategories({
      skip: offset,
      take: limit,
      where,
      orderBy: { name: 'asc' },
    })
  },
  
  /**
   * Finds a category by its unique ID.
   * @param {string} id - The unique identifier of the category.
   * @returns {Promise<Category | null>} - A promise that resolves to the category or null if not found.
   */
  async findById(id: string) {
    return databaseAdapter.findCategoryById(id)
  },
  
  /**
   * Finds a category by its slug.
   * @param {string} slug - The slug of the category.
   * @returns {Promise<Category | null>} - A promise that resolves to the category or null if not found.
   */
  async findBySlug(slug: string) {
    return databaseAdapter.findCategoryBySlug(slug)
  },
  
  /**
   * Finds a category along with its path by its slug.
   * @param {string} slug - The slug of the category.
   * @returns {Promise<CategoryWithPath | null>} - A promise that resolves to the category with its path or null if not found.
   */
  async findWithPath(slug: string) {
    const category = await databaseAdapter.findCategoryBySlug(slug)
    if (!category) return null
    
    const path = await this.buildCategoryPath(category.id)
    return { ...category, path }
  },
  
  /**
   * Creates a new category in the database.
   * @param {CreateCategory} data - The data for the new category.
   * @returns {Promise<Category>} - A promise that resolves to the created category.
   */
  async create(data: CreateCategory) {
    return databaseAdapter.createCategory(data)
  },
  
  /**
   * Updates an existing category in the database.
   * @param {string} id - The unique identifier of the category.
   * @param {UpdateCategory} data - The updated data for the category.
   * @returns {Promise<Category>} - A promise that resolves to the updated category.
   */
  async update(id: string, data: UpdateCategory) {
    return databaseAdapter.updateCategory(id, data)
  },
  
  /**
   * Deletes a category from the database.
   * @param {string} id - The unique identifier of the category.
   * @returns {Promise<Category | null>} - A promise that resolves to the deleted category or null if not found.
   */
  async delete(id: string) {
    return databaseAdapter.deleteCategory(id)
  },
  
  /**
   * Counts the number of categories in the database.
   * @returns {Promise<number>} - A promise that resolves to the count of categories.
   */
  async count() {
    return databaseAdapter.countCategories()
  },
  
  /**
   * Retrieves the path of a category by its slug.
   * @param {string} slug - The slug of the category.
   * @returns {Promise<CategoryWithPath | null>} - A promise that resolves to the category with its path or null if not found.
   */
  async getCategoryPath(slug: string): Promise<CategoryWithPath | null> {
    const category = await databaseAdapter.findCategoryBySlug(slug)
    if (!category) return null
    
    const path = await this.buildCategoryPath(category.id)
    return { ...category, path }
  },
  
  /**
   * Retrieves the children of a category by its parent ID.
   * @param {string} parentId - The unique identifier of the parent category.
   * @returns {Promise<Category[]>} - A promise that resolves to a list of child categories.
   */
  async getChildren(parentId: string) {
    return databaseAdapter.findCategories({
      where: { parentId },
      orderBy: { name: 'asc' }
    })
  },

  /**
   * Builds the path of a category by its ID.
   * @param {string} categoryId - The unique identifier of the category.
   * @returns {Promise<Object>} - A promise that resolves to the category path object.
   */
  async buildCategoryPath(categoryId: string) {
    const path = []
    let currentId: string | null = categoryId
    
    while (currentId) {
      const category = await databaseAdapter.findCategoryById(currentId)
      
      if (!category) break
      
      path.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug
      })
      
      currentId = category.parentId
    }
    
    return {
      ids: path.map(p => p.id),
      names: path.map(p => p.name),
      slugs: path.map(p => p.slug),
      fullPath: path.map(p => p.slug).join('/')
    }
  },
})