"use client"

import { Sidebar } from "./sidebar"
import { Category } from "@/data/categories/categories.types"

interface MainLayoutProps {
  categories: Category[]
  selectedCategoryIds: string[]
  onCategorySelectionChange: (selectedIds: string[]) => void
  isCategoryFilterPending?: boolean
  children: React.ReactNode
}

export function MainLayout({ 
  categories, 
  selectedCategoryIds, 
  onCategorySelectionChange, 
  isCategoryFilterPending = false,
  children 
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelectionChange={onCategorySelectionChange}
        isCategoryFilterPending={isCategoryFilterPending}
      />
      
      <div className="flex-1 overflow-auto min-w-0">
        <div className="p-6 w-full">
          {children}
        </div>
      </div>
    </div>
  )
} 