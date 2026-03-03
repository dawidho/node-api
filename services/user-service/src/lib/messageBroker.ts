// No-op MessageBroker to remove RabbitMQ dependency

interface DomainEvent {
  type: string
  data: any
}

export class MessageBroker {
  async connect(): Promise<void> {
    // no-op
  }

  async subscribe(
    _eventType: string,
    _handler: (event: { type: string; data: any }) => Promise<void>,
    _queueName: string
  ): Promise<void> {
    // no-op
  }

  async publish(_event: { type: string; data: any }): Promise<void> {
    // no-op
  }

  async close(): Promise<void> {
    // no-op
  }
}
