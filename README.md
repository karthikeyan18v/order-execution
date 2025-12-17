🧾 Order Execution Engine (DEX Routing + WebSockets)

A backend order execution engine that processes Market Orders with DEX routing, queue-based execution, and real-time WebSocket status updates.
The system simulates execution across Raydium and Meteora DEXs with realistic delays, routing decisions, retries, and lifecycle events.

🚀 Live Deployment

Public URL:
https://order-execution.onrender.com

Problem Scope

This project demonstrates how a real-world trading backend:

Accepts an order request
Routes it to the best DEX
Executes it asynchronously via a queue
Streams execution status live over WebSocket
Persists final execution results
Blockchain execution is mocked to focus on architecture, reliability, and real-time flow.

🧠 Chosen Order Type: Market Order

Why Market Order?
Market orders execute immediately at the best available price, making them ideal for demonstrating DEX routing, execution flow, queue processing, and real-time WebSocket updates without introducing price-trigger complexity.

Extending to Other Order Types:
The same engine can support Limit Orders by delaying execution until a target price is met, and Sniper Orders by triggering execution based on on-chain events (e.g., token launch or liquidity addition), while reusing the same queue, router, and WebSocket lifecycle.

Architecture Overview
```bash
Client
  │
  ├── POST /api/orders/execute
  │       ↓
  │   Idempotency Check (Redis)
  │       ↓
  │   Order Queue (BullMQ)
  │       ↓
  │   Worker (Execution Engine)
  │       ↓
  │   DEX Router (Raydium vs Meteora)
  │       ↓
  │   Redis (Live State) ──▶ WebSocket Updates
  │       ↓
  │   PostgreSQL (Final Order History)
```
🔁 Order Execution Lifecycle (WebSocket)

Each order streams the following states in real time:

pending – Order received and queued
routing – Comparing Raydium vs Meteora prices
building – Building transaction
submitted – Transaction submitted
confirmed – Execution successful (includes mock txHash)
failed – Execution failed (with error reason)


🔀 DEX Routing Logic (Mocked)

Quotes are fetched in parallel from:
Raydium
Meteora
Prices differ by ~2–5% with simulated latency
Best price is selected automatically
Routing decision is logged for transparency

📡 API Endpoints
1️⃣ Execute Order (HTTP)
POST /api/orders/execute
```bash
{
  "fromToken": "SOL",
  "toToken": "USDC",
  "amount": 1,
  "slippage": 0.5,
  "idempotencyKey": "order-123"
}
```
Response
```bash
{
  "orderId": "uuid",
  "status": "pending",
  "message": "Order accepted"
}
```
2️⃣ WebSocket Updates
URL ws://order-execution.onrender.com/api/orders/ws?orderId=<ORDER_ID>

Sample Messages
```bash
{ "status": "routing", "message": "Comparing DEX prices" }

{
  "status": "confirmed",
  "message": "Order confirmed",
  "data": {
    "dex": "Raydium",
    "executionPrice": 24.8,
    "txHash": "mock_tx_abc123"
  }
}
```
GET http://localhost:3000/api/orders/ORDER_ID_HERE
```bash
{
    "orders": [
        {
            "orderId": "528e0345-d19f-466a-8c07-95f65db03916",
            "status": "confirmed",
            "fromToken": "SOL",
            "toToken": "USDC",
            "amount": 1,
            "slippage": 0.5,
            "createdAt": "2025-12-17T01:47:55.995Z"
        }
    ],
    "count": 1
}
```


⚙️ Tech Stack

Node.js + TypeScript
Fastify (HTTP + WebSocket)
BullMQ + Redis (queue & active state)
PostgreSQL (order history)
Docker (local infra)
Render (deployment)

# Run App
npm install
npm run dev


