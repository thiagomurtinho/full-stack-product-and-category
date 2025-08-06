"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

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
  
  // Handle search input change
  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value) // Update local state immediately for UI responsiveness
    onSearchValueChange?.(value) // Notify parent of current value
  }, [onSearchValueChange])
  
  // Handle search button click
  const handleSearchClick = React.useCallback(() => {
    onSearchChange(searchValue)
  }, [onSearchChange, searchValue])
  
  // Handle clear button click
  const handleClearClick = React.useCallback(() => {
    setSearchValue("")
    onSearchValueChange?.("")
    onSearchChange("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [onSearchChange, onSearchValueChange])
  
  // Handle Enter key press
  const handleKeyPress = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchChange(searchValue)
    }
  }, [onSearchChange, searchValue])

  return (
    <div className="flex items-center gap-2 max-w-sm">
      <div className="relative flex-1">
        <Input
          ref={searchInputRef}
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          className="pr-8"
          disabled={isLoading}
        />
        {searchValue.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearClick}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        type="button"
        onClick={handleSearchClick}
        disabled={isLoading}
        className="px-4"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
} 