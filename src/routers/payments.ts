import { Router } from 'express'
import { chargeUser, getUserCharges } from '../controllers/paymentsController'

const paymentsRouter = Router()

paymentsRouter.post('/api/payments/charge', chargeUser)
paymentsRouter.get('/api/users/:id/charges', getUserCharges)

export { paymentsRouter }
