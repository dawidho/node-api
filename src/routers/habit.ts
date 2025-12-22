import { Router } from 'express'
import {
  createHabit,
  deleteHabit,
  getHabitById,
  getHabits,
  updateHabit,
} from '../controllers/habitController'
import { validateBody } from '../middleware/validation.ts'
import { createHabitSchema } from '../schemas/habitSchemas.ts'
import { authenticateToken } from '../middleware/auth.ts'

const habitRouter = Router()

habitRouter.use(authenticateToken)

habitRouter.get('/', getHabits)
habitRouter.get('/:id', getHabitById)
habitRouter.post('/', validateBody(createHabitSchema), createHabit)
habitRouter.put('/:id', updateHabit)
habitRouter.delete('/:id', deleteHabit)

export { habitRouter }
