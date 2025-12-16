"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActiveOrder = saveActiveOrder;
exports.getActiveOrder = getActiveOrder;
exports.getOrderSnapshot = getOrderSnapshot;
exports.appendOrderEvent = appendOrderEvent;
exports.getOrderEvents = getOrderEvents;
exports.updateOrderStatus = updateOrderStatus;
exports.removeActiveOrder = removeActiveOrder;
const redis_1 = require("../../config/redis");
// Save or update active order
async function saveActiveOrder(order) {
    await redis_1.redis.set(`order:${order.orderId}`, JSON.stringify(order));
}
// Get active order
async function getActiveOrder(orderId) {
    const data = await redis_1.redis.get(`order:${orderId}`);
    return data ? JSON.parse(data) : null;
}
// Snapshot for WebSocket late subscribers
async function getOrderSnapshot(orderId) {
    return getActiveOrder(orderId);
}
async function appendOrderEvent(orderId, event) {
    await redis_1.redis.rpush(`order:events:${orderId}`, JSON.stringify(event));
}
async function getOrderEvents(orderId) {
    const events = await redis_1.redis.lrange(`order:events:${orderId}`, 0, -1);
    return events.map(e => JSON.parse(e));
}
// Update only order status
async function updateOrderStatus(orderId, status) {
    const order = await getActiveOrder(orderId);
    if (!order)
        return;
    order.status = status;
    await saveActiveOrder(order);
}
// Cleanup after completion (optional)
async function removeActiveOrder(orderId) {
    await redis_1.redis.del(`order:${orderId}`);
}
