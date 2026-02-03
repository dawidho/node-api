import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import axios from 'axios'

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    })
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    })

    // Sync with Payment Service via HTTP
    try {
      await axios.put(`${PAYMENT_SERVICE_URL}/api/users/${id}/sync`, {
        email: user.email,
        name: user.name
      })
    } catch (error) {
      console.error('Failed to sync with Payment Service:', error)
    }

    res.json({ message: 'User updated', user })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await prisma.user.delete({ where: { id: parseInt(id) } })

    res.json({ message: `User ${id} deleted` })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const syncUser = async (req: Request, res: Response) => {
  const { id, email, name } = req.body

  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: { email, name },
      create: { id, email, name },
    })

    res.json({ message: 'User synced', user })
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ message: 'Failed to sync user' })
  }
}

