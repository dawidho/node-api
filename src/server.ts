import express from 'express'
import { userRouter } from './routers'

const app = express()

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Node express course api',
  })
})

app.use('/api/users', userRouter)

export { app }

export default app
