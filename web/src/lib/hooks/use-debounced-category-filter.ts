import { useState, useEffect, useCallback } from 'react'

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
 * Hook for debouncing category filter changes to avoid excessive API calls
 * when users rapidly select/deselect categories
 */
export function useDebouncedCategoryFilter({
  delay = 300,
  onCategoryChange
}: UseDebouncedCategoryFilterProps): UseDebouncedCategoryFilterReturn {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [debouncedCategoryIds, setDebouncedCategoryIds] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)

  // Debounce effect
  useEffect(() => {
    setIsPending(true)
    
    const timer = setTimeout(() => {
      setDebouncedCategoryIds(selectedCategoryIds)
      setIsPending(false)
    }, delay)

    return () => {
      clearTimeout(timer)
      setIsPending(false)
    }
  }, [selectedCategoryIds, delay])

  // Call onCategoryChange when debounced value changes
  useEffect(() => {
    onCategoryChange(debouncedCategoryIds)
  }, [debouncedCategoryIds, onCategoryChange])

  const handleSetSelectedCategoryIds = useCallback((categoryIds: string[]) => {
    setSelectedCategoryIds(categoryIds)
  }, [])

  return {
    selectedCategoryIds,
    setSelectedCategoryIds: handleSetSelectedCategoryIds,
    isPending
  }
} 