import { Router } from 'express'
import { getHabits, getHabitById, getHabitsByUserId, createHabit, updateHabit, deleteHabit } from '../controllers/habitController.js'
import { AuthMiddleware } from '../../../shared/src/middleware.js'

const router = Router()
const authMiddleware = new AuthMiddleware()

// All habit endpoints require authentication
router.get('/', authMiddleware.authenticate, getHabits)
router.get('/:id', authMiddleware.authenticate, getHabitById)
router.get('/user/:userId', authMiddleware.authenticate, getHabitsByUserId)
router.post('/', authMiddleware.authenticate, createHabit)
router.put('/:id', authMiddleware.authenticate, updateHabit)
router.delete('/:id', authMiddleware.authenticate, deleteHabit)

export default router

