"use client"

import { Button } from "@/components/ui/button"
import { CategoryTree } from "./category-tree"
import { Category } from "@/data/categories/categories.types"
import { X, Filter } from "lucide-react"

interface CategoryFilterProps {
  categories: Category[]
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  isPending?: boolean
}

export function CategoryFilter({ categories, selectedIds, onSelectionChange, isPending = false }: CategoryFilterProps) {
  const handleClearFilters = () => {
    onSelectionChange([])
  }

  const selectedCount = selectedIds.length

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Filter by Categories</h3>
          {isPending && (
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              <span>Applying...</span>
            </div>
          )}
        </div>
        {selectedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-1"
            disabled={isPending}
          >
            <X className="h-3 w-3" />
            Clear ({selectedCount})
          </Button>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <CategoryTree
          categories={categories}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
        />
      </div>
      
      {/* Active filters indicator */}
      {selectedCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Active Filters:</span>
            <span>{selectedCount} categor{selectedCount === 1 ? 'y' : 'ies'} selected</span>
          </div>
        </div>
      )}
    </div>
  )
} 