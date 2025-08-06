"use client"

import { CategoryFilter } from "../categories/category-filter"
import { Category } from "@/data/categories/categories.types"

interface SidebarProps {
  categories: Category[]
  selectedCategoryIds: string[]
  onCategorySelectionChange: (selectedIds: string[]) => void
  isCategoryFilterPending?: boolean
}

export function Sidebar({ categories, selectedCategoryIds, onCategorySelectionChange, isCategoryFilterPending = false }: SidebarProps) {
  const safeCategories = Array.isArray(categories) ? categories : []
  const safeSelectedCategoryIds = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : []

  return (
    <div className="w-72 bg-white border-r border-gray-200 p-6 h-screen overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Filters
        </h2>
        <p className="text-sm text-gray-600">
          Select categories to filter products
        </p>
      </div>
      
      <CategoryFilter
        categories={safeCategories}
        selectedIds={safeSelectedCategoryIds}
        onSelectionChange={onCategorySelectionChange}
        isPending={isCategoryFilterPending}
      />
    </div>
  )
} 