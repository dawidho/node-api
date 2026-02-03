import amqp, { Channel, Connection } from 'amqplib'
import { DomainEvent, EventType } from './events.js'

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

      // Create exchange for events
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true })

      console.log('✅ Connected to RabbitMQ')
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error)
      throw error
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized. Call connect() first.')
    }

    const routingKey = event.type
    const message = Buffer.from(JSON.stringify(event))

    this.channel.publish(this.exchange, routingKey, message, {
      persistent: true,
      contentType: 'application/json',
    })

    console.log(`📤 Published event: ${event.type}`)
  }

  async subscribe(
    eventType: EventType,
    handler: (event: DomainEvent) => Promise<void>,
    queueName: string
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized. Call connect() first.')
    }

    // Create queue
    await this.channel.assertQueue(queueName, { durable: true })

    // Bind queue to exchange with routing key
    await this.channel.bindQueue(queueName, this.exchange, eventType)

    // Consume messages
    this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const event: DomainEvent = JSON.parse(msg.content.toString())
          console.log(`📥 Received event: ${event.type}`)

          await handler(event)

          this.channel!.ack(msg)
        } catch (error) {
          console.error('Error handling message:', error)
          this.channel!.nack(msg, false, false) // Dead letter queue
        }
      }
    })

    console.log(`👂 Subscribed to: ${eventType}`)
  }

  async close(): Promise<void> {
    await this.channel?.close()
    await this.connection?.close()
    console.log('🔌 Disconnected from RabbitMQ')
  }
}

