import { Worker } from "bullmq";
import { redis } from "../../config/redis";
import { sendEvent, closeSocket } from "../../websocket/ws.manager";
import {
  saveActiveOrder,
  updateOrderStatus,
} from "./order.store";
import { OrderStatus } from "./order.types";
import { delay } from "../../utils/delay";

interface JobData {
  orderId: string;
  fromToken: string;
  toToken: string;
  amount: number;
  slippage: number;
}

export const orderWorker = new Worker<JobData>(
  "order-queue",
  async (job) => {
    const { orderId, fromToken, toToken, amount, slippage } = job.data;
    await delay(8000); 
    try {
      console.log("⚙️ Worker started:", orderId);

      // 1️⃣ Save full order (CRITICAL FIX)
      await saveActiveOrder({
        orderId,
        status: OrderStatus.PENDING,
        fromToken,
        toToken,
        amount,
        slippage,
        createdAt: new Date().toISOString(),
      });

      // 2️⃣ Routing
      await delay(5000);
      await updateOrderStatus(orderId, OrderStatus.ROUTING);
      sendEvent(orderId, { status: "routing", message: "Comparing DEX prices" });

      // 3️⃣ Building
      await delay(5000);
      await updateOrderStatus(orderId, OrderStatus.BUILDING);
      sendEvent(orderId, { status: "building", message: "Building transaction" });

      // 4️⃣ Submitted
      await delay(5000);
      await updateOrderStatus(orderId, OrderStatus.SUBMITTED);
      sendEvent(orderId, { status: "submitted", message: "Transaction submitted" });

      // 5️⃣ Confirmed
      await delay(6000);
      await updateOrderStatus(orderId, OrderStatus.CONFIRMED);
      sendEvent(orderId, {
        status: "confirmed",
        message: "Order confirmed",
        data: {
          dex: "Raydium",
          executionPrice: 24.8,
          txHash: `mock_tx_${orderId.slice(0, 6)}`,
        },
      });

      closeSocket(orderId);
      console.log("✅ Order confirmed:", orderId);

    } catch (err) {
      console.error("❌ Worker failed:", err);

      await updateOrderStatus(orderId, OrderStatus.FAILED);
      sendEvent(orderId, { status: "failed", message: "Order execution failed" });
      closeSocket(orderId);
    }
  },
  {
    connection: redis,
  }
);
