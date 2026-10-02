# Event-Driven Order Processing System

> Fully asynchronous order & inventory management system built with NestJS, Kafka, and PostgreSQL, featuring exactly-once processing guarantees.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Kafka](https://img.shields.io/badge/Kafka-ready-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

## Overview

This service handles the complete order lifecycle in an event-driven architecture:

- Order creation
- Inventory reservation
- Payment confirmation (simulated)
- Order completion / cancellation
- Exactly-once processing guarantees using the **Transactional Outbox** pattern + idempotent consumers

**Key capabilities:**
- Asynchronous processing with Kafka
- Strong consistency between Order and Inventory
- Idempotent event handlers
- Clear separation of concerns with NestJS modules
- Horizontal scaling of consumers
- Dockerized local development environment

## Architecture

Client / API
     │
     ▼
┌─────────────────────┐
│   Order Service     │  (NestJS)
│  - Create Order     │
│  - Outbox Writer    │
└──────────┬──────────┘
           │ (same DB transaction)
           ▼
┌─────────────────────┐
│   PostgreSQL        │
│  - orders           │
│  - inventory        │
│  - outbox           │
└──────────┬──────────┘
           │ Outbox Relay / CDC
           ▼
┌─────────────────────┐
│       Kafka         │
│  order.created      │
│  inventory.reserved │
│  order.completed    │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌────────────┐
│Inventory│  │  Other     │
│Consumer │  │ Consumers  │
└─────────┘  └────────────┘

### Design Decisions & Trade-offs

| Decision | Why | Trade-off |
|----------|-----|---------|
| Transactional Outbox | Guarantees that the event is only published if the DB transaction commits | Requires an outbox relay process |
| Idempotent consumers | Safe retries and exactly-once effect | Extra storage for processed event IDs |
| NestJS + Kafka | Clean modular structure + first-class microservice support | Slightly steeper learning curve than plain Express |
| PostgreSQL | Strong consistency + excellent support for transactions and JSON | Vertical scaling limits compared to distributed DBs |
| Event-driven choreography | Loose coupling between Order and Inventory | Harder to track overall business transaction (can add Saga later) |

## Tech Stack

- **Framework:** NestJS 10
- **Language:** TypeScript
- **Messaging:** Kafka (KafkaJS)
- **Database:** PostgreSQL + TypeORM
- **Validation:** class-validator / class-transformer
- **Infra:** Docker + Docker Compose

## Quick Start

```bash
git clone https://github.com/olabodeIdowu/event-driven-order-system.git
cd event-driven-order-system
cp .env.example .env
docker-compose up --build

API will be available at: http://localhost:3000Create a test orderbash

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_123",
    "items": [
      { "productId": "prod_1", "quantity": 2 },
      { "productId": "prod_2", "quantity": 1 }
    ]
  }'

Project Structure

src/
├── config/
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── entities/
│   └── dto/
├── inventory/
│   ├── inventory.module.ts
│   ├── inventory.controller.ts
│   ├── inventory.service.ts
│   └── entities/
├── outbox/
│   ├── outbox.module.ts
│   ├── outbox.service.ts
│   └── outbox.relay.ts
├── common/
│   └── filters/
├── app.module.ts
└── main.ts

What I OwnedEnd-to-end event-driven architecture
Transactional Outbox implementation for reliable publishing
Idempotent consumer design
Order ↔ Inventory consistency strategy
Kafka integration and topic design
Dockerized multi-service environment

Exactly-Once StrategyProducer side: Write business data + outbox record in the same database transaction.
Relay: A background process (or Debezium) publishes outbox records to Kafka and marks them as published.
Consumer side: Each consumer stores the event ID it has already processed. Duplicate events are ignored.

Future ImprovementsReplace polling relay with Debezium (CDC)
Add full Saga pattern for distributed transactions
Introduce schema registry (Avro / JSON Schema)
Add OpenTelemetry tracing across services
Implement compensating transactions for failures

