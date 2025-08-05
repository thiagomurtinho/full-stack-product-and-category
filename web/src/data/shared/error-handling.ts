import { ZodError } from 'zod'

/**
 * Represents an API error with a message and optional status code.
 * Used for consistent error handling across the application.
 */
export interface ApiError {
  message: string
  status?: number
}

/**
 * Checks if the given error is an instance of ApiError.
 * @param {unknown} error - The error to check.
 * @returns {boolean} - True if the error is an ApiError, false otherwise.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'status' in error
}

/**
 * Parses an unknown error into an ApiError object.
 * @param {unknown} error - The error to parse.
 * @returns {ApiError} - The parsed ApiError object.
 */
export function parseApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return {
      message: error.message,
      status: (error as ApiError).status,
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    }
  }
  
  return {
    message: 'Unknown error occurred',
    status: 500,
  }
}

/**
 * Validates an API response against a given schema with safe fallback.
 * @template T
 * @param {unknown} data - The data to validate.
 * @param {any} schema - The schema to validate against.
 * @param {object} options - Validation options.
 * @param {boolean} options.strict - Whether to throw on validation errors (default: true in dev, false in prod).
 * @param {string} options.context - Context information for logging.
 * @returns {T} - The validated data.
 * @throws {Error} - If validation fails and strict mode is enabled.
 */
export function validateApiResponse<T>(
  data: unknown, 
  schema: any, 
  options: { strict?: boolean; context?: string } = {}
): T {
  const { strict = process.env.NODE_ENV === 'development', context = 'API response' } = options

  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ')
      
      const errorMessage = `${context} validation failed: ${details}`
      
      // Always log validation errors for debugging
      console.warn(`⚠️ Validation Warning [${context}]:`, {
        error: errorMessage,
        data: data,
        issues: error.issues,
        timestamp: new Date().toISOString()
      })
      
      if (strict) {
        throw new Error(errorMessage)
      }
      
      // In non-strict mode, return data as-is with warning
      console.warn(`🔄 Falling back to unvalidated data for: ${context}`)
      return data as T
    }
    
    const errorMessage = `Validation error in ${context}: ${error}`
    console.error(`❌ Validation Error [${context}]:`, error)
    
    if (strict) {
      throw new Error(errorMessage)
    }
    
    return data as T
  }
}

/**
 * Safe validation helper for API responses.
 * Never throws, always returns data with optional validation.
 */
export function safeValidateApiResponse<T>(
  data: unknown, 
  schema: any, 
  context?: string
): T {
  return validateApiResponse<T>(data, schema, { strict: false, context })
}