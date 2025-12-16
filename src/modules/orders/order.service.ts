import { randomUUID } from "crypto";
import { orderQueue } from "./order.queue";
import { CreateOrderRequest } from "./order.types";

/**
 * Create a new order and enqueue it for execution
 */
export async function createOrder(body: CreateOrderRequest) {
  const orderId = randomUUID();

  await orderQueue.add("execute", {
    orderId,
    fromToken: body.fromToken,
    toToken: body.toToken,
    amount: body.amount,
    slippage: body.slippage,
  });

  return orderId;
}
