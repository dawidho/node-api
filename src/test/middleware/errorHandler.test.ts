import { describe, expect, it, vi } from 'vitest'
import { errorHandler } from '../../middleware/errorHandler'

describe('errorHandler middleware', () => {
  const req = {} as any
  const next = vi.fn()

  it('should handle generic error', () => {
    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status } as any
    const err = new Error('fail')
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith({ error: 'fail' })
  })

  it('should handle ValidationError', () => {
    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status } as any
    const err = { name: 'ValidationError', message: 'bad', stack: '', status: undefined } as any
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ error: 'Validation Error' })
  })

  it('should handle UnauthorizedError', () => {
    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status } as any
    const err = { name: 'UnauthorizedError', message: 'bad', stack: '', status: undefined } as any
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ error: 'Unauthorized' })
  })
})
