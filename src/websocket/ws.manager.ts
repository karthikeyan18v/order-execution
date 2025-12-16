import { getOrderSnapshot } from "../modules/orders/order.store";

// Map orderId → socket
const connections = new Map<string, any>();

export async function registerSocket(orderId: string, socket: any) {
  if (!socket || typeof socket.send !== "function") {
    console.error("❌ Invalid WebSocket for order:", orderId);
    return;
  }

  connections.set(orderId, socket);

  // Send last known state immediately
  const snapshot = await getOrderSnapshot(orderId);
  if (snapshot) {
    socket.send(
      JSON.stringify({
        status: snapshot.status,
        message: "Current order state",
      })
    );
  }
}

export function sendEvent(orderId: string, payload: any) {
  const socket = connections.get(orderId);
  if (socket && typeof socket.send === "function") {
    socket.send(JSON.stringify(payload));
  }
}

export function closeSocket(orderId: string) {
  const socket = connections.get(orderId);
  if (socket) {
    socket.close?.();
    connections.delete(orderId);
  }
}
