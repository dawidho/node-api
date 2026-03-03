import { describe, expect, it, vi } from 'vitest'
import { authenticateToken } from '../../middleware/auth'
import * as jwtUtils from '../../utils/jwt'

describe('authenticateToken middleware', () => {
  const next = vi.fn()
  const res = { sendStatus: vi.fn() } as any

  it('should call sendStatus(401) if no token', async () => {
    const req = { headers: {} } as any
    await authenticateToken(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('should call sendStatus(403) if token invalid', async () => {
    const req = { headers: { authorization: 'Bearer badtoken' } } as any
    vi.spyOn(jwtUtils, 'verifyToken').mockRejectedValueOnce(new Error('bad'))
    await authenticateToken(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('should set req.user and call next if token valid', async () => {
    const req: any = { headers: { authorization: 'Bearer goodtoken' } }
    const payload = { id: 1, email: 'a', username: 'b' }
    vi.spyOn(jwtUtils, 'verifyToken').mockResolvedValueOnce(payload)
    await authenticateToken(req, res, next)
    expect(req.user).toEqual(payload)
    expect(next).toHaveBeenCalled()
  })
})
