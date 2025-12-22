import express from 'express'
import { authRouter, habitRouter, userRouter } from './routers'
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
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/habits', habitRouter)

app.use(errorHandler)

export { app }

export default app
