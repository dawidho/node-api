import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
})

export const userIdSchema = z.object({
  userId: z.coerce.number().int().positive('User ID must be a positive integer'),
})

export const userLoginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1),
})
