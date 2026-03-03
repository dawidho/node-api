import { Router } from 'express'
import { userIdSchema } from '../schemas/userSchemas'
import { validateParams } from '../middleware/validation'
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController'

const userRouter = Router()

userRouter.get('/', getAllUsers)

userRouter.get('/:userId', validateParams(userIdSchema), getUserById)

userRouter.put('/:id', updateUser)

userRouter.delete('/:id', deleteUser)

export { userRouter }
