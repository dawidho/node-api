import { beforeEach, describe, expect, it, vi } from 'vitest'
import { chargeUser, getUserCharges } from '../../controllers/paymentsController'
import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    charge: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe('paymentsController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: any
  let jsonMock: any

  beforeEach(() => {
    statusMock = vi.fn().mockReturnThis()
    jsonMock = vi.fn().mockReturnThis()
    req = { params: {}, body: {} }
    res = { status: statusMock, json: jsonMock }
    vi.clearAllMocks()
  })

  it('should charge a user and return the charge', async () => {
    req.body = { userId: 1, amount: 100.5, description: 'Test charge' }
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 1 })
    ;(prisma.charge.create as any).mockResolvedValue({
      id: 1,
      userId: 1,
      amount: 100.5,
      description: 'Test charge',
    })
    await chargeUser(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(201)
    expect(jsonMock).toHaveBeenCalledWith({
      id: 1,
      userId: 1,
      amount: 100.5,
      description: 'Test charge',
    })
  })

  it('should return not found for non-existing user', async () => {
    req.body = { userId: 2, amount: 100.5 }
    ;(prisma.user.findUnique as any).mockResolvedValue(null)
    await chargeUser(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(404)
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: expect.any(String),
      },
    })
  })

  it('should return user charges', async () => {
    req.params = { id: '1' }
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 1 })
    ;(prisma.charge.findMany as any).mockResolvedValue([{ id: 1, userId: 1, amount: 100.5 }])
    await getUserCharges(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith([{ id: 1, userId: 1, amount: 100.5 }])
  })

  it('should return not found for non-existing user in charges', async () => {
    req.params = { id: '2' }
    ;(prisma.user.findUnique as any).mockResolvedValue(null)
    await getUserCharges(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(404)
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: expect.any(String),
      },
    })
  })

  it('should return validation error for invalid user id in charges', async () => {
    req.params = { id: '0' }
    await getUserCharges(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: expect.any(String),
      },
    })
  })
})
