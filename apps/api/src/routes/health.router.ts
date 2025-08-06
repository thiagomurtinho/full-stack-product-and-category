import { Router, Request, Response } from 'express'

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Checks server status and returns basic information
 *     responses:
 *       200:
 *         description: Server is running normally
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "ok"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               architecture: "Functional Core / Imperative Shell"
 *               version: "1.0.0"
 */
export const createHealthRouter = (): Router => {
  const router = Router()

  // Health check endpoint
  router.get('/', (_req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      architecture: 'Functional Core / Imperative Shell',
      version: '1.0.0'
    })
  })

  return router
} 