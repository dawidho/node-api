import { z } from 'zod'

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userId: z.int().positive(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().min(1, 'Target count must be at least 1').optional(),
  isActive: z.boolean().optional().default(true),
})

export const completeHabitParamsSchema = z.object({
  id: z.string().max(3),
})
