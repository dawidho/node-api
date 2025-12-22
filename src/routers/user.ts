import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { userIdSchema } from '../schemas/userSchemas.ts'
import { validateParams } from '../middleware/validation'

const userRouter = Router()

userRouter.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { habits: true },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

userRouter.get('/:userId', validateParams(userIdSchema), async (req, res) => {
  const { userId } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { habits: true },
    })
    if (user) {
      const { password, ...sanitizedUser } = user
      res.json(sanitizedUser)
    } else res.status(404).json({ message: 'User not found' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

userRouter.put('/:id', (req, res) => {
  const { id } = req.params

  res.json({ message: `User ${id} updated` })
})

userRouter.delete('/:id', (req, res) => {
  const { id } = req.params

  res.json({ message: `User ${id} deleted` })
})

export { userRouter }
