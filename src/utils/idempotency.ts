import { redis } from "../config/redis";

const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24; // 24 hours

// Check if idempotency key already exists
export async function getOrderByIdempotencyKey(
  key: string
): Promise<string | null> {
  return redis.get(`idem:${key}`);
}

// Save idempotency key → orderId
export async function saveIdempotencyKey(
  key: string,
  orderId: string
) {
  await redis.set(
    `idem:${key}`,
    orderId,
    "EX",
    IDEMPOTENCY_TTL_SECONDS
  );
}
