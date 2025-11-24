import type { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

export const validateParams = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject = JSON.parse(error.message)

        return res.status(400).json({
          error: 'Invalid parameters',
          details: errorObject.map((err) => err.message).join(', '),
        })
      }
      next(error)
    }
  }
}
