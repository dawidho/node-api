import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import type { AuthRequest } from '../../../shared/src/middleware.js'

export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    // Only show habits for authenticated user
    const habits = await prisma.habit.findMany({
      where: { userId: req.user!.id }
    })
    res.status(200).json(habits)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

export const getHabitById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  try {
    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } })

    // Check if habit belongs to user
    if (!habit) return res.status(404).json({ error: 'Habit not found' })
    if (habit.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.status(200).json(habit)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habit' })
  }
}

export const getHabitsByUserId = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params
  try {
    // Users can only see their own habits
    if (parseInt(userId) !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const habits = await prisma.habit.findMany({
      where: { userId: Number(userId) }
    })
    res.status(200).json(habits)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

export const createHabit = async (req: AuthRequest, res: Response) => {
  const { name, description, frequency, targetCount, isActive } = req.body
  try {
    // Create habit for authenticated user
    const habit = await prisma.habit.create({
      data: {
        userId: req.user!.id, // Use authenticated user's ID
        name,
        description,
        frequency,
        targetCount,
        isActive
      },
    })
    res.status(201).json(habit)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create habit' })
  }
}

export const updateHabit = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { name, description, frequency, targetCount, isActive } = req.body
  try {
    // Check ownership
    const existing = await prisma.habit.findUnique({ where: { id: Number(id) } })
    if (!existing) return res.status(404).json({ error: 'Habit not found' })
    if (existing.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const habit = await prisma.habit.update({
      where: { id: Number(id) },
      data: { name, description, frequency, targetCount, isActive },
    })
    res.status(200).json(habit)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update habit' })
  }
}

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  try {
    // Check ownership
    const existing = await prisma.habit.findUnique({ where: { id: Number(id) } })
    if (!existing) return res.status(404).json({ error: 'Habit not found' })
    if (existing.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    await prisma.habit.delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete habit' })
  }
}

