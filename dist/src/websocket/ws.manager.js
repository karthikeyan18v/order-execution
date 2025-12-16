"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocket = registerSocket;
exports.sendEvent = sendEvent;
exports.closeSocket = closeSocket;
const order_store_1 = require("../modules/orders/order.store");
// Map orderId → socket
const connections = new Map();
async function registerSocket(orderId, socket) {
    if (!socket || typeof socket.send !== "function") {
        console.error("❌ Invalid WebSocket for order:", orderId);
        return;
    }
    connections.set(orderId, socket);
    // Send last known state immediately
    const snapshot = await (0, order_store_1.getOrderSnapshot)(orderId);
    if (snapshot) {
        socket.send(JSON.stringify({
            status: snapshot.status,
            message: "Current order state",
        }));
    }
}
function sendEvent(orderId, payload) {
    const socket = connections.get(orderId);
    if (socket && typeof socket.send === "function") {
        socket.send(JSON.stringify(payload));
    }
}
function closeSocket(orderId) {
    const socket = connections.get(orderId);
    if (socket) {
        socket.close?.();
        connections.delete(orderId);
    }
}
