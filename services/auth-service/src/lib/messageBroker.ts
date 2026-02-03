import amqp, { Channel, Connection } from 'amqplib'

interface DomainEvent {
  type: string
  data: any
}

export class MessageBroker {
  private connection: Connection | null = null
  private channel: Channel | null = null
  private readonly url: string
  private readonly exchange = 'microservices.events'

  constructor(url: string = 'amqp://localhost') {
    this.url = url
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url)
      this.channel = await this.connection.createChannel()
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true })
      console.log('✅ Auth Service connected to RabbitMQ')
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error)
      console.log('⚠️  Continuing without RabbitMQ...')
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.channel) {
      console.log('⚠️  RabbitMQ not available, skipping event:', event.type)
      return
    }

    try {
      const routingKey = event.type
      const message = Buffer.from(JSON.stringify(event))
      this.channel.publish(this.exchange, routingKey, message, {
        persistent: true,
        contentType: 'application/json',
      })
      console.log(`📤 Published event: ${event.type}`)
    } catch (error) {
      console.error('Error publishing event:', error)
    }
  }

  async close(): Promise<void> {
    await this.channel?.close()
    await this.connection?.close()
  }
}

