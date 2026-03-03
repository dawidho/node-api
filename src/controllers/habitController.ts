import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getHabits = async (req: Request, res: Response) => {
  try {
    const habits = await prisma.habit.findMany()
    res.status(200).json(habits)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

export const getHabitById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } })
    if (!habit) return res.status(404).json({ error: 'Habit not found' })
    res.status(200).json(habit)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habit' })
  }
}

export const createHabit = async (req: Request, res: Response) => {
  const { userId, name, description, frequency, targetCount, isActive } = req.body
  try {
    const habit = await prisma.habit.create({
      data: { userId, name, description, frequency, targetCount, isActive },
    })
    res.status(201).json(habit)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create habit' })
  }
}

export const updateHabit = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, frequency, targetCount, isActive } = req.body
  try {
    const habit = await prisma.habit.update({
      where: { id: Number(id) },
      data: { name, description, frequency, targetCount, isActive },
    })
    res.status(200).json(habit)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update habit' })
  }
}

export const deleteHabit = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.habit.delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete habit' })
  }
}
