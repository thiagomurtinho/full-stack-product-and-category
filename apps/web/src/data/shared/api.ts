import { z } from 'zod'

/**
 * Base URL for the backend API.
 * Points to the local development server.
 */
export const API_BASE_URL = 'http://localhost:5005/api'

/**
 * Generic API request function that handles HTTP requests to the backend.
 * Provides consistent error handling and response processing.
 * 
 * @template T - The expected return type
 * @param {string} endpoint - The API endpoint path (without base URL)
 * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<[T | null, Error | null]>} Tuple with data and error
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<[T | null, Error | null]> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      return [null, new Error(`HTTP error! status: ${response.status}`)]
    }
    
    // If the response is 204 (No Content), don't try to parse JSON
    if (response.status === 204) {
      return [null as T, null]
    }
    
    const data = await response.json()
    return [data, null]
  } catch (error) {
    return [null, error instanceof Error ? error : new Error('Unknown error')]
  }
}

/**
 * API client object providing methods for different HTTP operations.
 * Each method uses the generic apiRequest function with appropriate configuration.
 */
export const api = {
  /**
   * Performs a GET request to the specified endpoint.
   * @template T - The expected return type
   * @param {string} endpoint - The API endpoint path
   * @returns {Promise<[T | null, Error | null]>} Tuple with data and error
   */
  get: <T>(endpoint: string): Promise<[T | null, Error | null]> => apiRequest<T>(endpoint),
  
  /**
   * Performs a POST request to the specified endpoint with data.
   * @template T - The expected return type
   * @param {string} endpoint - The API endpoint path
   * @param {any} data - The data to send in the request body
   * @returns {Promise<[T | null, Error | null]>} Tuple with data and error
   */
  post: <T>(endpoint: string, data: any): Promise<[T | null, Error | null]> =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  /**
   * Performs a PUT request to the specified endpoint with data.
   * @template T - The expected return type
   * @param {string} endpoint - The API endpoint path
   * @param {any} data - The data to send in the request body
   * @returns {Promise<[T | null, Error | null]>} Tuple with data and error
   */
  put: <T>(endpoint: string, data: any): Promise<[T | null, Error | null]> =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  /**
   * Performs a DELETE request to the specified endpoint.
   * @template T - The expected return type
   * @param {string} endpoint - The API endpoint path
   * @returns {Promise<[T | null, Error | null]>} Tuple with data and error
   */
  delete: <T>(endpoint: string): Promise<[T | null, Error | null]> =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
    }),
} 