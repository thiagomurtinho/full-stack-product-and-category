import express from 'express'
import cors from 'cors'
import { createMainRouter } from './routes/index'
import { createCategoryRepository } from './domain/categories/category.repository'
import { createProductRepository } from './domain/products/product.repository'
import { DatabaseAdapter } from './adapters/database/database.adapter'
import { errorHandler } from './middleware/error.handler'
import { requestLogger } from './middleware/request-logger'

// Main application factory function
export const createApp = (): express.Application => {
  const app = express()

  // CORS middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))

  // Body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Request logging middleware
  app.use(requestLogger)

  // Create database adapter
  const databaseAdapter = new DatabaseAdapter()

  // Create repositories
  const categoryRepository = createCategoryRepository(databaseAdapter)
  const productRepository = createProductRepository(databaseAdapter)

  // Create main router
  const mainRouter = createMainRouter(categoryRepository, productRepository)

  // Mount API routes
  app.use('/api', mainRouter)

  // Redirect /docs to /api/docs
  app.get('/docs', (_req, res) => {
    res.redirect('/api/docs')
  })

  // Error handling middleware
  app.use(errorHandler)

  return app
}

const startServer = () => {
  const app = createApp()
  const port = process.env.PORT || 5000

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
    console.log(`📡 API available at http://localhost:${port}/api`)
    console.log(`📚 API Documentation at http://localhost:${port}/api/docs`)
  })
}

// Start server if this file is run directly
if (require.main === module) {
  startServer()
} 