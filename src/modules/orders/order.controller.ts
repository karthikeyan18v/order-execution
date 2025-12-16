import { FastifyInstance } from "fastify";
import { z } from "zod";

import { createOrder } from "./order.service";
import { getActiveOrder } from "./order.store";
import {
  getOrderByIdempotencyKey,
  saveIdempotencyKey,
} from "../../utils/idempotency";
import { registerSocket } from "../../websocket/ws.manager";

/**
 * Request validation schema
 */
const schema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  amount: z.number().positive(),
  slippage: z.number().positive(),
  idempotencyKey: z.string().optional(),
});

/**
 * Order Controller
 */
export async function orderController(app: FastifyInstance) {
  /**
   * POST /api/orders/execute
   * Creates an order and enqueues it for execution
   */
  app.post("/api/orders/execute", async (req) => {
    const body = schema.parse(req.body);

    // Idempotency check
    if (body.idempotencyKey) {
      const existingOrderId = await getOrderByIdempotencyKey(
        body.idempotencyKey
      );

      if (existingOrderId) {
        return {
          orderId: existingOrderId,
          status: "existing",
        };
      }
    }

    // Create new order
    const orderId = await createOrder(body);

    // Save idempotency mapping
    if (body.idempotencyKey) {
      await saveIdempotencyKey(body.idempotencyKey, orderId);
    }

    return {
      orderId,
      status: "pending",
      message: "Order accepted",
    };
  });

  /**
   * GET /api/orders/:orderId
   * Get order details by ID
   */
  app.get("/api/orders/:orderId", async (req) => {
    const { orderId } = req.params as { orderId: string };
    const order = await getActiveOrder(orderId);
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    return order;
  });

  /**
   * GET /api/orders/ws
   * WebSocket endpoint for live order updates
   */
  app.get(
    "/api/orders/ws",
    { websocket: true },
    async (connection, req) => {
      const { orderId } = req.query as { orderId?: string };

      if (!orderId) {
        connection.close();
        return;
      }

      // Register WebSocket for this order
      await registerSocket(orderId, connection as any);
    }
  );
}
