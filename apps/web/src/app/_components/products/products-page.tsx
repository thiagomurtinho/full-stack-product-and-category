"use client"

import { useCallback } from "react"
import { MainLayout } from "../layout/main-layout"
import { ProductsTable } from "./products-table"
import { Category } from "@/data/categories/categories.types"
import { useDebouncedCategoryFilter } from "@/lib/hooks/use-debounced-category-filter"

interface ProductsPageProps {
  categories: Category[]
}
export function ProductsPage({ categories }: ProductsPageProps) {
  const handleCategoryChange = useCallback((selectedIds: string[]) => {
    // Category filter applied via debounce
  }, [])

  const {
    selectedCategoryIds,
    setSelectedCategoryIds,
    isPending: isCategoryFilterPending
  } = useDebouncedCategoryFilter({
    delay: 300,
    onCategoryChange: handleCategoryChange
  })

  const safeCategories = Array.isArray(categories) ? categories : []
  const safeSelectedCategoryIds = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : []

  return (
    <MainLayout
      categories={safeCategories}
      selectedCategoryIds={safeSelectedCategoryIds}
      onCategorySelectionChange={setSelectedCategoryIds}
      isCategoryFilterPending={isCategoryFilterPending}
    >
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your products easily using our modern interface
          </p>
        </div>

        <ProductsTable 
          selectedCategoryIds={safeSelectedCategoryIds}
          isCategoryFilterPending={isCategoryFilterPending}
        />
      </div>
    </MainLayout>
  )
} 