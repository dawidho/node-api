// Event Types for RabbitMQ
export enum EventType {
  USER_REGISTERED = 'user.registered',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  LOGIN_OCCURRED = 'user.login',
  CHARGE_CREATED = 'charge.created',
}

// User Events
export interface UserRegisteredEvent {
  type: EventType.USER_REGISTERED
  data: {
    userId: number
    email: string
    name: string
    timestamp: string
  }
}

export interface UserUpdatedEvent {
  type: EventType.USER_UPDATED
  data: {
    userId: number
    email: string
    name: string
    timestamp: string
  }
}

export interface UserDeletedEvent {
  type: EventType.USER_DELETED
  data: {
    userId: number
    timestamp: string
  }
}

export interface LoginOccurredEvent {
  type: EventType.LOGIN_OCCURRED
  data: {
    userId: number
    email: string
    name: string
    timestamp: string
  }
}

// Payment Events
export interface ChargeCreatedEvent {
  type: EventType.CHARGE_CREATED
  data: {
    chargeId: number
    userId: number
    amount: number
    description: string
    timestamp: string
  }
}

export type DomainEvent =
  | UserRegisteredEvent
  | UserUpdatedEvent
  | UserDeletedEvent
  | LoginOccurredEvent
  | ChargeCreatedEvent

