import { z } from 'zod'

export const chargeSchema = z.object({
  userId: z.number().positive(),
  amount: z.number().positive(),
  description: z.string().optional(),
  userEmail: z.string().email().optional(),
  userName: z.string().optional(),
})

