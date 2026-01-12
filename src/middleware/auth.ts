import { type NextFunction, type Request, type Response } from 'express'
import { type JwtPayload, verifyToken } from '../utils/jwt'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return res.sendStatus(401)
    }

    const payload = await verifyToken(token)

    req.user = payload
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}
