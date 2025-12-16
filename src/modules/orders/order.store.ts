import { redis } from "../../config/redis";
import { ActiveOrder, OrderStatus } from "./order.types";

// Save or update active order
export async function saveActiveOrder(order: ActiveOrder) {
  await redis.set(`order:${order.orderId}`, JSON.stringify(order));
}

// Get active order
export async function getActiveOrder(
  orderId: string
): Promise<ActiveOrder | null> {
  const data = await redis.get(`order:${orderId}`);
  return data ? JSON.parse(data) : null;
}

// Snapshot for WebSocket late subscribers
export async function getOrderSnapshot(orderId: string) {
  return getActiveOrder(orderId);
}
export async function appendOrderEvent(orderId: string, event: any) {
  await redis.rpush(`order:events:${orderId}`, JSON.stringify(event));
}

export async function getOrderEvents(orderId: string) {
  const events = await redis.lrange(`order:events:${orderId}`, 0, -1);
  return events.map(e => JSON.parse(e));
}

// Update only order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const order = await getActiveOrder(orderId);
  if (!order) return;

  order.status = status;
  await saveActiveOrder(order);
}

// Cleanup after completion (optional)
export async function removeActiveOrder(orderId: string) {
  await redis.del(`order:${orderId}`);
}
