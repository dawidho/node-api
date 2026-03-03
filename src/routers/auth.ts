import { Router } from 'express'
import { login, register } from '../controllers/authController'
import { validateBody } from '../middleware/validation'
import { userLoginSchema, userSchema } from '../schemas/userSchemas'

const authRouter = Router()

authRouter.post('/register', validateBody(userSchema), register)
authRouter.post('/login', validateBody(userLoginSchema), login)

export { authRouter }
