import { Product, CreateProduct, UpdateProduct, ProductWithCategories } from './product.types'

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedProducts {
  data: ProductWithCategories[]
  pagination: PaginationInfo
}

export interface ProductRepository {
  findAll(params?: { 
    limit?: number; 
    offset?: number; 
    search?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    orderBy?: 'name' | 'price' | 'createdAt';
    orderDirection?: 'asc' | 'desc';
  }): Promise<PaginatedProducts>
  
  findById(id: string): Promise<ProductWithCategories | null>
  findBySlug(slug: string): Promise<ProductWithCategories | null>
  
  create(data: CreateProduct): Promise<ProductWithCategories>
  update(id: string, data: UpdateProduct): Promise<ProductWithCategories | null>
  delete(id: string): Promise<ProductWithCategories | null>
  
  count(): Promise<number>
  countWithFilters(params?: {
    search?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
  }): Promise<number>
  findByCategoryPath(path: string[]): Promise<ProductWithCategories[]>
  searchByFuzzyMatch(query: string): Promise<ProductWithCategories[]>
  
  // Helper methods
  enrichProductWithPaths(product: any): Promise<ProductWithCategories>
  enrichProductsWithPaths(products: any[]): Promise<ProductWithCategories[]>
  buildCategoryPath(categoryId: string): Promise<{
    ids: string[];
    names: string[];
    slugs: string[];
    fullPath: string;
  }>
} 