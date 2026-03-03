import axios from 'axios'

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'

export async function chargeUserOnLogin(userId: number, userEmail: string, userName: string) {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_URL}/api/charges`, {
      userId,
      amount: 1,
      description: 'Login charge',
      userEmail,
      userName
    })
    return response.data
  } catch (error) {
    console.error('Failed to charge user:', error)
    throw error
  }
}

