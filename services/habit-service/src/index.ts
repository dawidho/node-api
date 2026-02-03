import express from 'express'
import habitRouter from './routes/habit.js'

const app = express()
const PORT = process.env.PORT || 3004

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Habit Service' })
})

app.use('/api/habits', habitRouter)

app.listen(PORT, () => {
  console.log(`✅ Habit Service running on port ${PORT}`)
})
