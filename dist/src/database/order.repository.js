"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFinalOrder = saveFinalOrder;
const postgres_1 = require("../config/postgres");
/**
 * Save final order result (only once order is completed or failed)
 */
async function saveFinalOrder(params) {
    const { orderId, status, dex, executionPrice, txHash, error, } = params;
    await postgres_1.pgPool.query(`
    INSERT INTO orders
      (order_id, status, dex, execution_price, tx_hash, error)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    `, [orderId, status, dex, executionPrice, txHash, error]);
}
