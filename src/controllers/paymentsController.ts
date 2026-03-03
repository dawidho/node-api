import { prisma } from '../lib/prisma'
import { chargeSchema } from '../schemas/chargeSchemas'

function errorResponse(code: string, message: string) {
  return {
    error: {
      code,
      message,
    },
  }
}

export async function chargeUser(req, res) {
  try {
    const parse = chargeSchema.safeParse(req.body)
    if (!parse.success) {
      return res.status(400).json(errorResponse('VALIDATION_ERROR', parse.error.issues[0].message))
    }
    const { userId, amount, description } = parse.data
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
    if (!user) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'))
    }
    const charge = await prisma.charge.create({
      data: {
        userId: Number(userId),
        amount: Number(amount),
        description,
      },
    })
    return res.status(201).json(charge)
  } catch (err) {
    return res.status(500).json(errorResponse('INTERNAL_ERROR', 'Unexpected error'))
  }
}

export async function getUserCharges(req, res) {
  try {
    const userId = Number(req.params.id)
    if (!userId || userId <= 0) {
      return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid user ID'))
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'))
    }
    const charges = await prisma.charge.findMany({ where: { userId } })
    return res.status(200).json(charges)
  } catch (err) {
    return res.status(500).json(errorResponse('INTERNAL_ERROR', 'Unexpected error'))
  }
}
