import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { userIdSchema } from '../schemas/userSchemas.ts'
import { validateParams } from '../middleware/validation'
import { register } from '../controllers/authController.ts'

const userRouter = Router()

userRouter.get('/', (req, res) => {
  res.send('User endpoint is working')
})

userRouter.get('/:userId', validateParams(userIdSchema), async (req, res) => {
  const { userId } = req.params
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })
    if (user) res.json(user)
    else res.status(404).json({ message: 'User not found' })
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
