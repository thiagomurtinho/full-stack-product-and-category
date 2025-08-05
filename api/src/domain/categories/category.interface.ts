import { Category, CreateCategory, UpdateCategory, CategoryWithPath } from './category.types'

export interface CategoryRepository {
  findAll(params?: { 
    limit?: number; 
    offset?: number; 
    search?: string;
    parentId?: string | null;
  }): Promise<Category[]>
  
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
  findWithPath(slug: string): Promise<CategoryWithPath | null>
  
  create(data: CreateCategory): Promise<Category>
  update(id: string, data: UpdateCategory): Promise<Category | null>
  delete(id: string): Promise<Category | null>
  
  count(): Promise<number>
  getCategoryPath(slug: string): Promise<CategoryWithPath | null>
  getChildren(parentId: string): Promise<Category[]>
  buildCategoryPath(categoryId: string): Promise<{
    ids: string[];
    names: string[];
    slugs: string[];
    fullPath: string;
  }>
} 