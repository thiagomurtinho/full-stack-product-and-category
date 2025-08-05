import { Router, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { specs } from '../config/swagger.config'

export const createDocsRouter = (): Router => {
  const router = Router()

  // Swagger UI setup options
  const swaggerUiOptions = {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    `,
          customSiteTitle: 'Full Stack Product and Category API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      syntaxHighlight: {
        theme: 'agate'
      }
    }
  }

  // Serve OpenAPI JSON spec
  router.get('/openapi.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.json(specs)
  })

  // Serve Swagger UI
  router.use('/', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions))

  return router
}
