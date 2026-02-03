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
      console.log('✅ User Service connected to RabbitMQ')
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error)
      console.log('⚠️  Continuing without RabbitMQ...')
    }
  }

  async subscribe(
    eventType: string,
    handler: (event: DomainEvent) => Promise<void>,
    queueName: string
  ): Promise<void> {
    if (!this.channel) {
      console.log('⚠️  RabbitMQ not available, skipping subscription')
      return
    }

    try {
      await this.channel.assertQueue(queueName, { durable: true })
      await this.channel.bindQueue(queueName, this.exchange, eventType)

      this.channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const event: DomainEvent = JSON.parse(msg.content.toString())
            console.log(`📥 Received event: ${event.type}`)
            await handler(event)
            this.channel!.ack(msg)
          } catch (error) {
            console.error('Error handling message:', error)
            this.channel!.nack(msg, false, false)
          }
        }
      })

      console.log(`👂 Subscribed to: ${eventType}`)
    } catch (error) {
      console.error('Error subscribing to events:', error)
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

