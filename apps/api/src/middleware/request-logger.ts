import { Request, Response, NextFunction } from 'express'

interface RequestLog {
  timestamp: string
  method: string
  url: string
  statusCode: number
  responseTime: number
  userAgent?: string
  ip?: string
  contentLength?: number
}

/**
 * Middleware for logging HTTP requests and responses.
 * Logs request details at the start and response details at the end, including response time and status.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  // Log request start
  console.log(`\n📥 ${req.method} ${req.originalUrl} - Started`)
  
  // Capture original send method
  const originalSend = res.send
  
  // Override send method to capture response data
  res.send = function(body) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      contentLength: body ? Buffer.byteLength(body) : 0
    }
    
    // Format log message with colors
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m'
    const resetColor = '\x1b[0m'
    const methodColor = '\x1b[36m'
    
    console.log(
      `📤 ${methodColor}${log.method}${resetColor} ${log.url} ${statusColor}${log.statusCode}${resetColor} ${log.responseTime}ms ${log.contentLength}b`
    )
    
    // Log additional details for errors
    if (res.statusCode >= 400) {
      console.error(`  ❌ Error Details: ${JSON.stringify({
        timestamp: log.timestamp,
        userAgent: log.userAgent,
        ip: log.ip,
        body: req.body,
        query: req.query,
        params: req.params
      }, null, 2)}`)
    }
    
    return originalSend.call(this, body)
  }
  
  next()
}