"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "@/lib/hooks/use-debounce"

interface SearchInputProps {
  onSearchChange: (search: string) => void
  onSearchValueChange?: (value: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function SearchInput({ 
  onSearchChange, 
  onSearchValueChange,
  isLoading = false, 
  placeholder = "Search products..." 
}: SearchInputProps) {
  const [searchValue, setSearchValue] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [shouldMaintainFocus, setShouldMaintainFocus] = React.useState(false)
  
  // Debounced search callback
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      onSearchChange(value)
    },
    300 // 300ms delay
  )
  
  // Track when user is typing to maintain focus
  React.useEffect(() => {
    if (searchValue.length > 0) {
      setShouldMaintainFocus(true)
    }
  }, [searchValue])
  
  // Keep focus on search input during loading if user was typing
  React.useEffect(() => {
    if (isLoading && shouldMaintainFocus && searchInputRef.current) {
      // Small delay to ensure the component has re-rendered
      const timeoutId = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 0)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isLoading, shouldMaintainFocus])

  // Handle search input with debounce
  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value) // Update local state immediately for UI responsiveness
    onSearchValueChange?.(value) // Notify parent of current value
    debouncedSearch(value) // Debounced API call
  }, [debouncedSearch, onSearchValueChange])
  
  // Handle search input blur
  const handleSearchBlur = React.useCallback(() => {
    setShouldMaintainFocus(false)
  }, [])

  return (
    <Input
      ref={searchInputRef}
      placeholder={placeholder}
      value={searchValue}
      onChange={handleSearchChange}
      onBlur={handleSearchBlur}
      className="max-w-sm"
      disabled={isLoading}
    />
  )
} 