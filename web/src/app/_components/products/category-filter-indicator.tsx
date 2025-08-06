"use client"

import * as React from "react"

interface CategoryFilterIndicatorProps {
  isCategoryFilterPending?: boolean
}

export function CategoryFilterIndicator({ 
  isCategoryFilterPending = false 
}: CategoryFilterIndicatorProps) {
  if (!isCategoryFilterPending) {
    return null
  }

  return (
    <div className="ml-4 flex items-center gap-2 text-sm text-blue-600">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span>Applying category filter...</span>
    </div>
  )
} 