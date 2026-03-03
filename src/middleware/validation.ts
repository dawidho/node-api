import type { NextFunction, Request, Response } from 'express'
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

export const validateBody = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next()
      }
      next(error)
    }
  }
}
