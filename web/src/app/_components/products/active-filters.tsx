"use client"

import * as React from "react"

interface ActiveFiltersProps {
  searchValue?: string
  isCategoryFilterPending?: boolean
}

export function ActiveFilters({ 
  searchValue, 
  isCategoryFilterPending = false 
}: ActiveFiltersProps) {
  const hasActiveFilters = searchValue || isCategoryFilterPending

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="ml-4 flex items-center gap-2 text-sm text-gray-600">
      <span>Active filters:</span>
      {searchValue && (
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          Search: "{searchValue}"
        </span>
      )}
      {isCategoryFilterPending && (
        <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
          Categories
        </span>
      )}
    </div>
  )
} 