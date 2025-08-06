import React, { useState, useEffect, useCallback } from 'react'

/**
 * Hook para debounce de valores
 * @param value - O valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 300ms)
 * @returns O valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de função
 * @param callback - A função a ser debounced
 * @param delay - Delay em milissegundos (padrão: 300ms)
 * @returns A função debounced
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay]
  )
} 