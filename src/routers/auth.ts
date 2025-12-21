import { Router } from 'express'
import { register } from '../controllers/authController.ts'
import { validateBody } from '../middleware/validation.ts'
import { userSchema } from '../schemas/userSchemas.ts'

const authRouter = Router()

authRouter.post('/register', validateBody(userSchema), register)
authRouter.post('/login', (req, res) => {
  res.status(201).json({ message: 'Login endpoint' })
})

export { authRouter }
