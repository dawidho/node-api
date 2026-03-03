import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createHabit,
  deleteHabit,
  getHabitById,
  getHabits,
  updateHabit,
} from '../../controllers/habitController'
import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

vi.mock('../../lib/prisma', () => ({
  prisma: {
    habit: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe('habitController', () => {
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

  it('getHabits returns habits', async () => {
    ;(prisma.habit.findMany as any).mockResolvedValue([{ id: 1, name: 'H' }])
    await getHabits(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith([{ id: 1, name: 'H' }])
  })

  it('getHabitById returns habit', async () => {
    req.params = { id: '1' }
    ;(prisma.habit.findUnique as any).mockResolvedValue({ id: 1, name: 'H' })
    await getHabitById(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith({ id: 1, name: 'H' })
  })

  it('getHabitById returns 404 if not found', async () => {
    req.params = { id: '2' }
    ;(prisma.habit.findUnique as any).mockResolvedValue(null)
    await getHabitById(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(404)
  })

  it('createHabit creates habit', async () => {
    req.body = {
      userId: 1,
      name: 'H',
      description: '',
      frequency: '',
      targetCount: 1,
      isActive: true,
    }
    ;(prisma.habit.create as any).mockResolvedValue({ id: 1, name: 'H' })
    await createHabit(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(201)
    expect(jsonMock).toHaveBeenCalledWith({ id: 1, name: 'H' })
  })

  it('updateHabit updates habit', async () => {
    req.params = { id: '1' }
    req.body = { name: 'H', description: '', frequency: '', targetCount: 1, isActive: true }
    ;(prisma.habit.update as any).mockResolvedValue({ id: 1, name: 'H' })
    await updateHabit(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith({ id: 1, name: 'H' })
  })

  it('deleteHabit deletes habit', async () => {
    req.params = { id: '1' }
    ;(prisma.habit.delete as any).mockResolvedValue({})
    await deleteHabit(req as Request, res as Response)
    expect(statusMock).toHaveBeenCalledWith(204)
    expect(sendMock).toHaveBeenCalled()
  })
})
