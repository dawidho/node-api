import { prisma } from '../lib/prisma.js'
import { MessageBroker } from '../lib/messageBroker.js'

const broker = new MessageBroker(process.env.RABBITMQ_URL)

export async function setupEventHandlers() {
  await broker.connect()

  // Listen for USER_REGISTERED events from Auth Service
  await broker.subscribe(
    'user.registered',
    async (event) => {
      const { userId, email, name } = event.data

      console.log(`👤 Syncing new user ${userId}...`)

      try {
        await prisma.user.upsert({
          where: { id: userId },
          update: { email, name },
          create: { id: userId, email, name },
        })

        console.log(`✅ User ${userId} synced from registration`)
      } catch (error) {
        console.error('Error syncing user:', error)
      }
    },
    'user-service.user-registration'
  )
}

export { broker }

