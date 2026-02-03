import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const DEFAULT_SECRET = 'default-secret-change-in-production'

export interface TokenPayload extends JWTPayload {
  id: number
  email: string
  username: string
}

export class JwtService {
  private readonly secret: Uint8Array

  constructor(secretKey?: string) {
    const key = secretKey || process.env.JWT_SECRET || DEFAULT_SECRET
    this.secret = new TextEncoder().encode(key)
  }

  async generateToken(payload: { id: number; email: string; username: string }): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .sign(this.secret)
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret)
      return payload as TokenPayload
    } catch (error) {
      console.error('JWT verification failed:', error)
      return null
    }
  }

  extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null
    }

    return parts[1]
  }
}

