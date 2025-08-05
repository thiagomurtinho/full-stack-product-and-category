import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '@/data/products/products.api'
import { ProductWithCategories, PaginationInfo } from '@/data/products/products.types'

interface UseServerPaginationProps {
  initialLimit?: number
  selectedCategoryIds?: string[]
}

interface UseServerPaginationReturn {
  products: ProductWithCategories[]
  pagination: PaginationInfo | null
  isLoading: boolean
  error: string | null
  currentPage: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  total: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  refresh: () => void
}

export function useServerPagination({ 
  initialLimit = 10, 
  selectedCategoryIds = [] 
}: UseServerPaginationProps = {}): UseServerPaginationReturn {
  const [products, setProducts] = useState<ProductWithCategories[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialLimit)
  const [search, setSearch] = useState('')

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const offset = (currentPage - 1) * pageSize
      
      const result = await productsApi.getAll({
        limit: pageSize,
        offset,
        search: search || undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        orderBy: 'createdAt',
        orderDirection: 'desc'
      })
      
      setProducts(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, search, selectedCategoryIds])

  // Reset to first page when category filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategoryIds])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSetPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }, [])

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  const refresh = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    pagination,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages: pagination?.totalPages || 0,
    hasNext: pagination?.hasNext || false,
    hasPrev: pagination?.hasPrev || false,
    total: pagination?.total || 0,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    refresh
  }
} 