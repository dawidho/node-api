import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { habits: true },
    })
    res.json(users)
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { habits: true },
    })
    if (user) {
      res.json(user)
    } else res.status(404).json({ message: 'User not found' })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ message: `User ${id} updated` })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    await prisma.$transaction([
      prisma.habit.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.user.delete({ where: { id: parseInt(id) } }),
    ])
    res.json({ message: `User ${id} and their habits deleted` })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}
