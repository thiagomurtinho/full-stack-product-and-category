"use client"

import { useCallback } from "react"
import { MainLayout } from "../layout/main-layout"
import { ProductsTable } from "./products-table"
import { Product } from "@/data/products/products.types"
import { Category } from "@/data/categories/categories.types"
import { useDebouncedCategoryFilter } from "@/lib/hooks/use-debounced-category-filter"

interface ProductsPageProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ProductsPage({ initialProducts, categories }: ProductsPageProps) {
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

  return (
    <MainLayout
      categories={categories}
      selectedCategoryIds={selectedCategoryIds}
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
          initialProducts={initialProducts} 
          selectedCategoryIds={selectedCategoryIds}
          isCategoryFilterPending={isCategoryFilterPending}
        />
      </div>
    </MainLayout>
  )
} 