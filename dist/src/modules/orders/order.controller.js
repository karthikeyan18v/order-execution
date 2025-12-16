"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = orderController;
const zod_1 = require("zod");
const order_service_1 = require("./order.service");
const order_store_1 = require("./order.store");
const idempotency_1 = require("../../utils/idempotency");
const ws_manager_1 = require("../../websocket/ws.manager");
/**
 * Request validation schema
 */
const schema = zod_1.z.object({
    fromToken: zod_1.z.string(),
    toToken: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    slippage: zod_1.z.number().positive(),
    idempotencyKey: zod_1.z.string().optional(),
});
/**
 * Order Controller
 */
async function orderController(app) {
    /**
     * POST /api/orders/execute
     * Creates an order and enqueues it for execution
     */
    app.post("/api/orders/execute", async (req) => {
        const body = schema.parse(req.body);
        // Idempotency check
        if (body.idempotencyKey) {
            const existingOrderId = await (0, idempotency_1.getOrderByIdempotencyKey)(body.idempotencyKey);
            if (existingOrderId) {
                return {
                    orderId: existingOrderId,
                    status: "existing",
                };
            }
        }
        // Create new order
        const orderId = await (0, order_service_1.createOrder)(body);
        // Save idempotency mapping
        if (body.idempotencyKey) {
            await (0, idempotency_1.saveIdempotencyKey)(body.idempotencyKey, orderId);
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
        const { orderId } = req.params;
        const order = await (0, order_store_1.getActiveOrder)(orderId);
        if (!order) {
            return { error: "Order not found" };
        }
        return order;
    });
    /**
     * GET /api/orders/ws
     * WebSocket endpoint for live order updates
     */
    app.get("/api/orders/ws", { websocket: true }, async (connection, req) => {
        const { orderId } = req.query;
        if (!orderId) {
            connection.close();
            return;
        }
        // Register WebSocket for this order
        await (0, ws_manager_1.registerSocket)(orderId, connection);
    });
}
