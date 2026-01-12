import { z } from 'zod'

export const chargeSchema = z.object({
  userId: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().int().positive()
  ),
  amount: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().positive()
  ),
  description: z.string().optional(),
})
