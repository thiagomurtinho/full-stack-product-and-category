import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Adapter for interacting with the database using Prisma.
 */
export class DatabaseAdapter {
  /**
   * Finds categories based on the provided parameters.
   * @param {Object} params - Query parameters for filtering and pagination.
   * @returns {Promise<Category[]>} - A promise that resolves to a list of categories.
   */
  async findCategories(params: { skip?: number; take?: number; where?: any; orderBy?: any }) {
    return prisma.category.findMany(params)
  }

  /**
   * Finds a category by its unique ID.
   * @param {string} id - The unique identifier of the category.
   * @returns {Promise<Category | null>} - A promise that resolves to the category or null if not found.
   */
  async findCategoryById(id: string) {
    return prisma.category.findUnique({ where: { id } })
  }

  /**
   * Finds a category by its slug.
   * @param {string} slug - The slug of the category.
   * @returns {Promise<Category | null>} - A promise that resolves to the category or null if not found.
   */
  async findCategoryBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } })
  }

  /**
   * Creates a new category in the database.
   * @param {Object} data - The data for the new category.
   * @returns {Promise<Category>} - A promise that resolves to the created category.
   */
  async createCategory(data: any) {
    return prisma.category.create({ data })
  }

  /**
   * Updates an existing category in the database.
   * @param {string} id - The unique identifier of the category.
   * @param {Object} data - The updated data for the category.
   * @returns {Promise<Category>} - A promise that resolves to the updated category.
   */
  async updateCategory(id: string, data: any) {
    return prisma.category.update({ where: { id }, data })
  }

  /**
   * Deletes a category from the database.
   * @param {string} id - The unique identifier of the category.
   * @returns {Promise<Category>} - A promise that resolves to the deleted category.
   */
  async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } })
  }

  /**
   * Counts the number of categories matching the provided criteria.
   * @param {Object} [where] - The criteria for counting categories.
   * @returns {Promise<number>} - A promise that resolves to the count of categories.
   */
  async countCategories(where?: any) {
    return prisma.category.count({ where })
  }

  /**
   * Finds products based on the provided parameters.
   * @param {Object} params - Query parameters for filtering and pagination.
   * @returns {Promise<Product[]>} - A promise that resolves to a list of products.
   */
  async findProducts(params: { skip?: number; take?: number; where?: any; orderBy?: any; include?: any }) {
    return prisma.product.findMany(params)
  }

  /**
   * Finds a product by its unique ID.
   * @param {string} id - The unique identifier of the product.
   * @param {Object} [include] - Additional relations to include in the query.
   * @returns {Promise<Product | null>} - A promise that resolves to the product or null if not found.
   */
  async findProductById(id: string, include?: any) {
    return prisma.product.findUnique({ where: { id }, include })
  }

  /**
   * Finds a product by its slug.
   * @param {string} slug - The slug of the product.
   * @param {Object} [include] - Additional relations to include in the query.
   * @returns {Promise<Product | null>} - A promise that resolves to the product or null if not found.
   */
  async findProductBySlug(slug: string, include?: any) {
    return prisma.product.findUnique({ where: { slug }, include })
  }

  /**
   * Creates a new product in the database.
   * @param {Object} data - The data for the new product.
   * @returns {Promise<Product>} - A promise that resolves to the created product.
   */
  async createProduct(data: any) {
    return prisma.product.create({ 
      data,
      include: {
        categories: {
          include: {
            parent: true
          }
        }
      }
    })
  }

  /**
   * Updates an existing product in the database.
   * @param {string} id - The unique identifier of the product.
   * @param {Object} data - The updated data for the product.
   * @returns {Promise<Product>} - A promise that resolves to the updated product.
   */
  async updateProduct(id: string, data: any) {
    return prisma.product.update({ 
      where: { id }, 
      data,
      include: {
        categories: {
          include: {
            parent: true
          }
        }
      }
    })
  }

  /**
   * Deletes a product from the database.
   * @param {string} id - The unique identifier of the product.
   * @returns {Promise<Product | null>} - A promise that resolves to the deleted product or null if not found.
   */
  async deleteProduct(id: string) {
    try {
      return await prisma.product.delete({ 
        where: { id },
        include: {
          categories: {
            include: {
              parent: true
            }
          }
        }
      })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null // Product not found
      }
      throw error
    }
  }

  /**
   * Counts the number of products matching the provided criteria.
   * @param {Object} [where] - The criteria for counting products.
   * @returns {Promise<number>} - A promise that resolves to the count of products.
   */
  async countProducts(where?: any) {
    return prisma.product.count({ where })
  }

  /**
   * Executes a transaction using the Prisma client.
   * @template T
   * @param {function} fn - The function to execute within the transaction.
   * @returns {Promise<T>} - A promise that resolves to the result of the transaction.
   */
  async transaction<T>(fn: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn)
  }

  /**
   * Disconnects the Prisma client from the database.
   * @returns {Promise<void>} - A promise that resolves when the client is disconnected.
   */
  async disconnect() {
    await prisma.$disconnect()
  }
}