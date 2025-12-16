"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const ws_manager_1 = require("../../websocket/ws.manager");
const order_store_1 = require("./order.store");
const order_types_1 = require("./order.types");
const delay_1 = require("../../utils/delay");
exports.orderWorker = new bullmq_1.Worker("order-queue", async (job) => {
    const { orderId, fromToken, toToken, amount, slippage } = job.data;
    await (0, delay_1.delay)(8000);
    try {
        console.log("⚙️ Worker started:", orderId);
        // 1️⃣ Save full order (CRITICAL FIX)
        await (0, order_store_1.saveActiveOrder)({
            orderId,
            status: order_types_1.OrderStatus.PENDING,
            fromToken,
            toToken,
            amount,
            slippage,
            createdAt: new Date().toISOString(),
        });
        // 2️⃣ Routing
        await (0, delay_1.delay)(5000);
        await (0, order_store_1.updateOrderStatus)(orderId, order_types_1.OrderStatus.ROUTING);
        (0, ws_manager_1.sendEvent)(orderId, { status: "routing", message: "Comparing DEX prices" });
        // 3️⃣ Building
        await (0, delay_1.delay)(5000);
        await (0, order_store_1.updateOrderStatus)(orderId, order_types_1.OrderStatus.BUILDING);
        (0, ws_manager_1.sendEvent)(orderId, { status: "building", message: "Building transaction" });
        // 4️⃣ Submitted
        await (0, delay_1.delay)(5000);
        await (0, order_store_1.updateOrderStatus)(orderId, order_types_1.OrderStatus.SUBMITTED);
        (0, ws_manager_1.sendEvent)(orderId, { status: "submitted", message: "Transaction submitted" });
        // 5️⃣ Confirmed
        await (0, delay_1.delay)(6000);
        await (0, order_store_1.updateOrderStatus)(orderId, order_types_1.OrderStatus.CONFIRMED);
        (0, ws_manager_1.sendEvent)(orderId, {
            status: "confirmed",
            message: "Order confirmed",
            data: {
                dex: "Raydium",
                executionPrice: 24.8,
                txHash: `mock_tx_${orderId.slice(0, 6)}`,
            },
        });
        (0, ws_manager_1.closeSocket)(orderId);
        console.log("✅ Order confirmed:", orderId);
    }
    catch (err) {
        console.error("❌ Worker failed:", err);
        await (0, order_store_1.updateOrderStatus)(orderId, order_types_1.OrderStatus.FAILED);
        (0, ws_manager_1.sendEvent)(orderId, { status: "failed", message: "Order execution failed" });
        (0, ws_manager_1.closeSocket)(orderId);
    }
}, {
    connection: redis_1.redis,
});
