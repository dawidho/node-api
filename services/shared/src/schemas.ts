import { z } from 'zod'

// User Schemas
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
})

export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Charge Schemas
export const chargeSchema = z.object({
  userId: z.number().positive(),
  amount: z.number().positive(),
  description: z.string().optional(),
  userEmail: z.string().email().optional(),
  userName: z.string().optional(),
})

// Habit Schemas
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

export type User = z.infer<typeof userSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type Login = z.infer<typeof loginSchema>
export type Charge = z.infer<typeof chargeSchema>
export type Habit = z.infer<typeof habitSchema>
export type HabitUpdate = z.infer<typeof updateHabitSchema>

