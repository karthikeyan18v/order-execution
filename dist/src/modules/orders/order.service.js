"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
const crypto_1 = require("crypto");
const order_queue_1 = require("./order.queue");
/**
 * Create a new order and enqueue it for execution
 */
async function createOrder(body) {
    const orderId = (0, crypto_1.randomUUID)();
    await order_queue_1.orderQueue.add("execute", {
        orderId,
        fromToken: body.fromToken,
        toToken: body.toToken,
        amount: body.amount,
        slippage: body.slippage,
    });
    return orderId;
}
