import express from 'express'
import { authRouter, userRouter } from './routers'

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

export { app }

export default app
