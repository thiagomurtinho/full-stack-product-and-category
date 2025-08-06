import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

/**
 * Middleware for handling errors in the application.
 * Logs the error and sends an appropriate HTTP response based on the error type.
 * @param {Error} error - The error object.
 * @param {Request} _req - The HTTP request object (unused).
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} _next - The next middleware function (unused).
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', error)

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    })
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any

    // Handle specific Prisma error codes
    switch (prismaError.code) {
      case 'P2025':
        return res.status(404).json({
          error: 'Not Found',
          message: 'The requested record does not exist'
        })
      case 'P2002':
        return res.status(409).json({
          error: 'Conflict',
          message: 'A record with this unique field already exists'
        })
      case 'P2003':
        return res.status(400).json({
          error: 'Foreign Key Constraint',
          message: 'Cannot delete this record due to foreign key constraints'
        })
      default:
        return res.status(400).json({
          error: 'Database Error',
          message: 'Invalid request to database'
        })
    }
  }

  if (error.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data provided'
    })
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  })
}