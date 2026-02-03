import express from 'express'
import paymentsRouter from './routes/payments.js'

const app = express()
const PORT = process.env.PORT || 3003

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Payment Service' })
})

app.use('/api', paymentsRouter)

app.listen(PORT, () => {
  console.log(`💳 Payment Service running on port ${PORT}`)
})

