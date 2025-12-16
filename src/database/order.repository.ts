import { pgPool } from "../config/postgres";
import { OrderStatus } from "../modules/orders/order.types";

/**
 * Save final order result (only once order is completed or failed)
 */
export async function saveFinalOrder(params: {
  orderId: string;
  status: OrderStatus;
  dex?: string;
  executionPrice?: number;
  txHash?: string;
  error?: string;
}) {
  const {
    orderId,
    status,
    dex,
    executionPrice,
    txHash,
    error,
  } = params;

  await pgPool.query(
    `
    INSERT INTO orders
      (order_id, status, dex, execution_price, tx_hash, error)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    `,
    [orderId, status, dex, executionPrice, txHash, error]
  );
}
