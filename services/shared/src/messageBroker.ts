// No-op MessageBroker (RabbitMQ removed)
import { DomainEvent } from './events.js'

export class MessageBroker {
  async connect(): Promise<void> {
    // no-op
  }

  async publish(_event: DomainEvent): Promise<void> {
    // no-op
  }

  async subscribe(
    _eventType: string,
    _handler: (event: DomainEvent) => Promise<void>,
    _queueName: string
  ): Promise<void> {
    // no-op
  }

  async close(): Promise<void> {
    // no-op
  }
}
