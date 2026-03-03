import express from 'express'
import authRouter from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Auth Service' })
})

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`)
})

