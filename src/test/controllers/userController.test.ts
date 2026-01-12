import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteUser, getAllUsers, getUserById, updateUser } from '../../controllers/userController'
import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    habit: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

describe('userController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: any
  let jsonMock: any
  let sendMock: any

  beforeEach(() => {
    statusMock = vi.fn().mockReturnThis()
    jsonMock = vi.fn().mockReturnThis()
    sendMock = vi.fn().mockReturnThis()
    req = { params: {}, body: {} }
    res = { status: statusMock, json: jsonMock, send: sendMock }
    vi.clearAllMocks()
  })

  it('getAllUsers returns users', async () => {
    ;(prisma.user.findMany as any).mockResolvedValue([{ id: 1, name: 'A' }])
    await getAllUsers(req as Request, res as Response)
    expect(jsonMock).toHaveBeenCalledWith([{ id: 1, name: 'A' }])
  })

  it('getUserById returns user', async () => {
    req.params = { userId: '1' }
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 1, name: 'A' })
    await getUserById(req as Request, res as Response)
    expect(jsonMock).toHaveBeenCalledWith({ id: 1, name: 'A' })
  })

  it('getUserById returns 404 if not found', async () => {
    req.params = { userId: '2' }
    ;(prisma.user.findUnique as any).mockResolvedValue(null)
    await getUserById(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(404)
  })

  it('updateUser returns update message', () => {
    req.params = { id: '1' }
    updateUser(req as Request, res as Response)
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User 1 updated' })
  })

  it('deleteUser deletes user and habits', async () => {
    req.params = { id: '1' }
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 1 })
    ;(prisma.$transaction as any).mockResolvedValue(true)
    await deleteUser(req as Request, res as Response)
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User 1 and their habits deleted' })
  })

  it('deleteUser returns 404 if user not found', async () => {
    req.params = { id: '2' }
    ;(prisma.user.findUnique as any).mockResolvedValue(null)
    await deleteUser(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(404)
  })
})
