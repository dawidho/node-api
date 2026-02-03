import { z } from 'zod'

export const habitSchema = z.object({
  userId: z.number().positive(),
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.string().default('daily'),
  targetCount: z.number().positive().default(1),
  isActive: z.boolean().default(true),
})

export const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.string().optional(),
  targetCount: z.number().positive().optional(),
  isActive: z.boolean().optional(),
})
