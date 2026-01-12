import express from 'express'
import * as routers from './routers'
import { errorHandler } from './middleware/errorHandler.ts'

const app = express()

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Node express course api',
  })
})

app.use(express.json())
app.use('/api/users', routers.userRouter)
app.use('/api/auth', routers.authRouter)
app.use('/api/habits', routers.habitRouter)
app.use(routers.paymentsRouter)

app.use(errorHandler)

export { app }

export default app
