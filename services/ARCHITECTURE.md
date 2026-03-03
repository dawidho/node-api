# Architecture Diagram

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
└────────────┬────────────────────┬──────────────────┬────────────────────┘
             │                    │                  │
             │                    │                  │
    ┌────────▼────────┐  ┌────────▼────────┐  ┌─────▼──────┐  ┌──────────┐
    │  Auth Service   │  │  User Service   │  │  Payment   │  │  Habit   │
    │   Port 3001     │  │   Port 3002     │  │  Service   │  │ Service  │
    │                 │  │                 │  │ Port 3003  │  │Port 3004 │
    └────────┬────────┘  └────────┬────────┘  └─────┬──────┘  └──────┬───┘
             │                    │                  │                │
    ┌────────▼────────┐  ┌────────▼────────┐  ┌─────▼──────┐  ┌──────▼───┐
    │   Auth DB       │  │   User DB       │  │ Payment DB │  │ Habit DB │
    │   Port 5433     │  │   Port 5434     │  │ Port 5435  │  │Port 5436 │
    └─────────────────┘  └─────────────────┘  └────────────┘  └──────────┘
```

## Service Communication Flow

### 1. Registration Flow
```
┌────────┐     ┌──────────────┐     ┌──────────────┐
│ Client │────▶│ Auth Service │────▶│ User Service │
└────────┘     └──────────────┘     └──────────────┘
                      │                     │
                      │                     │
                   Creates              Syncs user
                    User               (POST /api/users/sync)
                      │                     │
                      ▼                     ▼
                 ┌─────────┐          ┌─────────┐
                 │ Auth DB │          │ User DB │
                 └─────────┘          └─────────┘
```

### 2. Login Flow (with $1 charge)
```
┌────────┐     ┌──────────────┐     ┌──────────────────┐
│ Client │────▶│ Auth Service │────▶│ Payment Service  │
└────────┘     └──────────────┘     └──────────────────┘
                      │                      │
                  Verifies                   │
                  Password            Creates $1 charge
                      │                + syncs user
                      │               (POST /api/charges)
                      ▼                      │
                 ┌─────────┐                 ▼
                 │ Auth DB │           ┌──────────┐
                 └─────────┘           │Payment DB│
                                       └──────────┘
```

### 3. User Update Flow
```
┌────────┐     ┌──────────────┐     ┌──────────────────┐
│ Client │────▶│ User Service │────▶│ Payment Service  │
└────────┘     └──────────────┘     └──────────────────┘
                      │                      │
                  Updates                    │
                   User              Syncs user data
                      │             (PUT /api/users/:id/sync)
                      ▼                      │
                 ┌─────────┐                 ▼
                 │ User DB │           ┌──────────┐
                 └─────────┘           │Payment DB│
                                       └──────────┘
```

### 4. Habit Management (Independent)
```
┌────────┐     ┌──────────────┐
│ Client │────▶│Habit Service │
└────────┘     └──────────────┘
                      │
                  Manages
                  Habits
                      │
                      ▼
                 ┌─────────┐
                 │Habit DB │
                 └─────────┘
```

## Data Models

### Auth Service DB
```
User
├── id (PK, auto)
├── email (unique)
├── name
├── password (hashed)
├── createdAt
└── updatedAt
```

### User Service DB
```
User
├── id (PK, manual)
├── email (unique)
├── name
├── createdAt
└── updatedAt
```

### Payment Service DB
```
User                    Charge
├── id (PK, manual)    ├── id (PK, auto)
├── email (unique)     ├── userId (FK → User.id)
├── name               ├── amount
├── createdAt          ├── description
└── updatedAt          └── createdAt
```

### Habit Service DB
```
Habit
├── id (PK, auto)
├── userId
├── name
├── description
├── frequency
├── targetCount
├── isActive
├── createdAt
└── updatedAt
```

## API Endpoints

### Auth Service (3001)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /health
```

### User Service (3002)
```
GET    /api/users
GET    /api/users/:userId
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/sync        (internal)
GET    /health
```

### Payment Service (3003)
```
POST   /api/charges
GET    /api/charges/user/:id
PUT    /api/users/:id/sync    (internal)
GET    /health
```

### Habit Service (3004)
```
GET    /api/habits
GET    /api/habits/:id
GET    /api/habits/user/:userId
POST   /api/habits
PUT    /api/habits/:id
DELETE /api/habits/:id
GET    /health
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           Application Layer             │
│  ┌──────────────────────────────────┐  │
│  │  TypeScript + Node.js + Express  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          Communication Layer            │
│  ┌──────────────────────────────────┐  │
│  │     HTTP REST APIs (axios)       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           Database Layer                │
│  ┌──────────────────────────────────┐  │
│  │ PostgreSQL + Prisma ORM (4 DBs)  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  ┌──────────────────────────────────┐  │
│  │        Docker Compose            │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Deployment Considerations

### Each Service Can Scale Independently
```
                 ┌──────────────┐
    Load        ││ Auth Service ││
   Balancer     ││   Instance   ││
                ││     1,2,3    ││
                 └──────────────┘
                       │
                       ▼
                 ┌──────────┐
                 │ Auth DB  │
                 │ (shared) │
                 └──────────┘
```

### Service Discovery
```
Currently: Hard-coded URLs in .env
Future: Service registry (Consul, Eureka)
```

### API Gateway (Future Enhancement)
```
     ┌────────┐
     │ Client │
     └────┬───┘
          │
     ┌────▼─────────┐
     │ API Gateway  │
     │ (Port 3000)  │
     └────┬─────────┘
          │
     ┌────┼────┬────┬────┐
     │    │    │    │    │
   Auth User Pay Habit  │
   3001 3002 3003 3004  │
```

## Security Considerations

1. **Authentication**: JWT tokens in Auth Service
2. **Authorization**: Each service validates requests
3. **API Keys**: Services should authenticate each other
4. **Rate Limiting**: Prevent abuse
5. **HTTPS**: All production traffic encrypted

## Monitoring & Observability

### Health Checks
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

### Logging Strategy
- Each service logs independently
- Centralized logging (future: ELK stack)
- Request tracing (future: distributed tracing)

### Metrics to Monitor
- Request count per endpoint
- Response time
- Error rate
- Database connection pool
- Inter-service call latency
```

