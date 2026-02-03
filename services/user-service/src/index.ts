import express from 'express'
import userRouter from './routes/user.js'

const app = express()
const PORT = process.env.PORT || 3002

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'User Service' })
})

app.use('/api/users', userRouter)

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`)
})

