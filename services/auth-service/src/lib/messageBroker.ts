// No-op MessageBroker to remove RabbitMQ dependency

interface DomainEvent {
  type: string
  data: any
}

export class MessageBroker {
  async connect(): Promise<void> {
    // no-op
  }

  async publish(_event: DomainEvent): Promise<void> {
    // no-op
  }

  async close(): Promise<void> {
    // no-op
  }
}
