import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from './use-debounce'

interface UseDebouncedCategoryFilterProps {
  delay?: number
  onCategoryChange: (categoryIds: string[]) => void
}

interface UseDebouncedCategoryFilterReturn {
  selectedCategoryIds: string[]
  setSelectedCategoryIds: (categoryIds: string[]) => void
  isPending: boolean
}

/**
 * Hook for debounced category filtering.
 * Provides a debounced interface for category selection with loading state.
 */
export function useDebouncedCategoryFilter({
  delay = 300,
  onCategoryChange
}: UseDebouncedCategoryFilterProps): UseDebouncedCategoryFilterReturn {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)
  
  // Debounce the selected category IDs
  const debouncedCategoryIds = useDebounce(selectedCategoryIds, delay)
  
  // Effect to trigger category change when debounced value changes
  useEffect(() => {
    const safeCategoryIds = Array.isArray(debouncedCategoryIds) ? debouncedCategoryIds : []
    
    // Set pending state when categories are being changed
    if (!areArraysEqual(safeCategoryIds, selectedCategoryIds)) {
      setIsPending(true)
      
      // Call the category change callback
      onCategoryChange(safeCategoryIds)
      
      // Clear pending state after a short delay
      const timeoutId = setTimeout(() => {
        setIsPending(false)
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [debouncedCategoryIds, selectedCategoryIds, onCategoryChange])
  
  // Handler to update selected category IDs
  const handleSetSelectedCategoryIds = useCallback((categoryIds: string[]) => {
    const safeCategoryIds = Array.isArray(categoryIds) ? categoryIds : []
    setSelectedCategoryIds(safeCategoryIds)
  }, [])
  
  return {
    selectedCategoryIds,
    setSelectedCategoryIds: handleSetSelectedCategoryIds,
    isPending
  }
} 