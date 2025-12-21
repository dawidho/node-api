import { Router } from 'express'
import { login, register } from '../controllers/authController.ts'
import { validateBody } from '../middleware/validation.ts'
import { userLoginSchema, userSchema } from '../schemas/userSchemas.ts'

const authRouter = Router()

authRouter.post('/register', validateBody(userSchema), register)
authRouter.post('/login', validateBody(userLoginSchema), login)

export { authRouter }
