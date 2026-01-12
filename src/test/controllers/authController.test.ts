import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login, register } from '../../controllers/authController'
import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('../../utils/password', async () => {
  return {
    hashPassword: vi.fn(async (pw) => 'hashed_' + pw),
    comparePassword: vi.fn(async (pw, hash) => pw === 'valid' && hash === 'hashed_valid'),
  }
})

vi.mock('../../utils/jwt', () => ({
  generateToken: vi.fn(async () => 'mocked_token'),
}))

describe('authController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: any
  let jsonMock: any

  beforeEach(() => {
    statusMock = vi.fn().mockReturnThis()
    jsonMock = vi.fn().mockReturnThis()
    req = { body: {} }
    res = { status: statusMock, json: jsonMock }
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should register user and return token', async () => {
      req.body = { email: 'test@test.com', password: 'pass', name: 'Test' }
      ;(prisma.user.create as any).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        name: 'Test',
      })
      await register(req as Request, res as Response)
      expect(statusMock).toHaveBeenCalledWith(201)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User registered successfully', token: 'mocked_token' })
      )
    })
    it('should handle duplicate email', async () => {
      req.body = { email: 'dup@test.com', password: 'pass', name: 'Dup' }
      ;(prisma.user.create as any).mockRejectedValue({ code: 'P2002' })
      await register(req as Request, res as Response)
      expect(statusMock).toHaveBeenCalledWith(409)
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Email already in use' })
    })
  })

  describe('login', () => {
    it('should login user and return token', async () => {
      req.body = { email: 'test@test.com', password: 'valid' }
      ;(prisma.user.findUnique as any).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed_valid',
        name: 'Test',
      })
      await login(req as Request, res as Response)
      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Login successful', token: 'mocked_token' })
      )
    })
    it('should return 401 for invalid user', async () => {
      req.body = { email: 'nouser@test.com', password: 'pass' }
      ;(prisma.user.findUnique as any).mockResolvedValue(null)
      await login(req as Request, res as Response)
      expect(statusMock).toHaveBeenCalledWith(401)
      expect(jsonMock).toHaveBeenCalledWith({ message: 'invalid credentials' })
    })
    it('should return 401 for invalid password', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' }
      ;(prisma.user.findUnique as any).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed_valid',
        name: 'Test',
      })
      await login(req as Request, res as Response)
      expect(statusMock).toHaveBeenCalledWith(401)
      expect(jsonMock).toHaveBeenCalledWith({ message: 'invalid credentials' })
    })
  })
})
