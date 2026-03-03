import { describe, expect, it } from 'vitest'
import * as jwtUtils from '../../utils/jwt'

const payload = { id: 1, email: 'test@example.com', username: 'testuser' }

describe('jwt utils', () => {
  it('should generate and verify a token', async () => {
    const token = await jwtUtils.generateToken(payload)
    expect(typeof token).toBe('string')
    const verified = await jwtUtils.verifyToken(token)
    expect(verified).toMatchObject(payload)
  })

  it('should decode a token', async () => {
    const token = await jwtUtils.generateToken(payload)
    const decoded = jwtUtils.decodeToken(token)
    expect(decoded).toMatchObject(payload)
  })

  it('should return null for invalid token on decode', () => {
    expect(jwtUtils.decodeToken('invalid.token')).toBeNull()
  })
})
