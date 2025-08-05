import { ProductRepository, PaginatedProducts, PaginationInfo } from './product.interface'
import { CreateProduct, UpdateProduct, ProductWithCategories } from './product.types'
import { DatabaseAdapter } from '../../adapters/database/database.adapter'

/**
 * Repository for managing product-related operations.
 * Provides methods to interact with the database for CRUD operations and additional utilities.
 */
export const createProductRepository = (databaseAdapter: DatabaseAdapter): ProductRepository => ({
  /**
   * Retrieves all products based on the provided parameters.
   * @param {Object} params - Query parameters for filtering and pagination.
   * @returns {Promise<PaginatedProducts>} - A promise that resolves to paginated products.
   */
  async findAll(params = {}) {
    const { limit = 20, offset = 0, search, categoryIds, minPrice, maxPrice, orderBy = 'name', orderDirection = 'asc' } = params
    
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    if (categoryIds && categoryIds.length > 0) {
      where.categories = { some: { id: { in: categoryIds } } }
    }
    
    // Get total count with same filters
    const total = await this.countWithFilters({ search, categoryIds, minPrice, maxPrice })
    
    // Get paginated products
    const products = await databaseAdapter.findProducts({
      skip: offset,
      take: limit,
      where,
      orderBy: { [orderBy]: orderDirection },
      include: {
        categories: {
          include: {
            parent: true
          }
        }
      }
    })
    
    const enrichedProducts = await this.enrichProductsWithPaths(products)
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const currentPage = Math.floor(offset / limit) + 1
    const hasNext = currentPage < totalPages
    const hasPrev = currentPage > 1
    
    const pagination: PaginationInfo = {
      total,
      limit,
      offset,
      totalPages,
      currentPage,
      hasNext,
      hasPrev
    }
    
    return {
      data: enrichedProducts,
      pagination
    }
  },
  
  /**
   * Finds a product by its unique ID.
   * @param {string} id - The unique identifier of the product.
   * @returns {Promise<Product | null>} - A promise that resolves to the product or null if not found.
   */
  async findById(id: string) {
    const product = await databaseAdapter.findProductById(id, {
      categories: {
        include: {
          parent: true
        }
      }
    })
    
    if (!product) return null
    return this.enrichProductWithPaths(product)
  },
  
  /**
   * Finds a product by its slug.
   * @param {string} slug - The slug of the product.
   * @returns {Promise<Product | null>} - A promise that resolves to the product or null if not found.
   */
  async findBySlug(slug: string) {
    const product = await databaseAdapter.findProductBySlug(slug, {
      categories: {
        include: {
          parent: true
        }
      }
    })
    
    if (!product) return null
    return this.enrichProductWithPaths(product)
  },
  
  /**
   * Creates a new product in the database.
   * @param {CreateProduct} data - The data for the new product.
   * @returns {Promise<Product>} - A promise that resolves to the created product.
   */
  async create(data: CreateProduct) {
    const { categoryIds, ...productData } = data
    
    const product = await databaseAdapter.createProduct({
      ...productData,
      categories: {
        connect: categoryIds.map(id => ({ id }))
      }
    })
    
    // Fetch the product again to ensure we have the complete data with categories
    const completeProduct = await this.findById(product.id)
    if (!completeProduct) {
      throw new Error('Failed to create product')
    }
    
    return completeProduct
  },
  
  /**
   * Updates an existing product in the database.
   * @param {string} id - The unique identifier of the product.
   * @param {UpdateProduct} data - The updated data for the product.
   * @returns {Promise<Product>} - A promise that resolves to the updated product.
   */
  async update(id: string, data: UpdateProduct) {
    const { categoryIds, ...productData } = data
    
    const updateData: any = { ...productData }
    if (categoryIds) {
      updateData.categories = {
        set: categoryIds.map(catId => ({ id: catId }))
      }
    }
    
    const product = await databaseAdapter.updateProduct(id, updateData)
    
    return this.enrichProductWithPaths(product)
  },
  
  /**
   * Deletes a product from the database.
   * @param {string} id - The unique identifier of the product.
   * @returns {Promise<Product | null>} - A promise that resolves to the deleted product or null if not found.
   */
  async delete(id: string) {
    const product = await databaseAdapter.deleteProduct(id)
    
    // If product was not found, return null
    if (!product) {
      return null
    }
    
    // Return the deleted product with categories
    return this.enrichProductWithPaths(product)
  },
  
  /**
   * Counts the number of products in the database.
   * @returns {Promise<number>} - A promise that resolves to the count of products.
   */
  async count() {
    return databaseAdapter.countProducts()
  },

  /**
   * Counts the number of products with filters applied.
   * @param {Object} params - Filter parameters for counting.
   * @returns {Promise<number>} - A promise that resolves to the count of filtered products.
   */
  async countWithFilters(params = {}) {
    const { search, categoryIds, minPrice, maxPrice } = params
    
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    if (categoryIds && categoryIds.length > 0) {
      where.categories = { some: { id: { in: categoryIds } } }
    }
    
    return databaseAdapter.countProducts(where)
  },
  
  /**
   * Retrieves products by their category path.
   * @param {string[]} path - The category path segments.
   * @returns {Promise<Product[]>} - A promise that resolves to a list of products.
   */
  async findByCategoryPath(path: string[]) {
    const products = await databaseAdapter.findProducts({
      where: {
        categories: {
          some: {
            slug: { in: path }
          }
        }
      },
      include: {
        categories: {
          include: {
            parent: true
          }
        }
      }
    })
    
    return this.enrichProductsWithPaths(products)
  },
  
  /**
   * Searches for products using a fuzzy match query.
   * @param {string} query - The search query string.
   * @returns {Promise<Product[]>} - A promise that resolves to a list of products.
   */
  async searchByFuzzyMatch(query: string) {
    const products = await databaseAdapter.findProducts({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { slug: { contains: query } },
        ]
      },
      include: {
        categories: {
          include: {
            parent: true
          }
        }
      }
    })
    
    return this.enrichProductsWithPaths(products)
  },

  /**
   * Enriches a product with its category paths.
   * @param {Object} product - The product to enrich.
   * @returns {Promise<ProductWithCategories>} - A promise that resolves to the enriched product.
   */
  async enrichProductWithPaths(product: any): Promise<ProductWithCategories> {
    if (!product) return null as any
    
    // Ensure categories exists and is an array
    if (!product.categories || !Array.isArray(product.categories)) {
      return {
        ...product,
        categoryIds: [],
        categories: [],
        categoryPaths: []
      }
    }
    
    const categoriesWithPaths = await Promise.all(
      product.categories.map(async (category: any) => {
        const path = await this.buildCategoryPath(category.id)
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          path
        }
      })
    )
    
    const categoryPaths = categoriesWithPaths.map(cat => cat.path.fullPath)
    
    return {
      ...product,
      categoryIds: product.categories.map((c: any) => c.id),
      categories: categoriesWithPaths,
      categoryPaths
    }
  },
  
  /**
   * Enriches a list of products with their category paths.
   * @param {Object[]} products - The products to enrich.
   * @returns {Promise<ProductWithCategories[]>} - A promise that resolves to the enriched products.
   */
  async enrichProductsWithPaths(products: any[]): Promise<ProductWithCategories[]> {
    return Promise.all(products.map(product => this.enrichProductWithPaths(product)))
  },

  /**
   * Builds the path of a category by its ID.
   * @param {string} categoryId - The unique identifier of the category.
   * @returns {Promise<Object>} - A promise that resolves to the category path object.
   */
  async buildCategoryPath(categoryId: string) {
    const path = []
    let currentId = categoryId
    
    while (currentId) {
      const category = await databaseAdapter.findCategoryById(currentId)
      
      if (!category) break
      
      path.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug
      })
      
      currentId = category.parentId || ''
    }
    
    return {
      ids: path.map(p => p.id),
      names: path.map(p => p.name),
      slugs: path.map(p => p.slug),
      fullPath: path.map(p => p.slug).join('/')
    }
  },
})