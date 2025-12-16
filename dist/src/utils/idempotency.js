"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByIdempotencyKey = getOrderByIdempotencyKey;
exports.saveIdempotencyKey = saveIdempotencyKey;
const redis_1 = require("../config/redis");
const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24; // 24 hours
// Check if idempotency key already exists
async function getOrderByIdempotencyKey(key) {
    return redis_1.redis.get(`idem:${key}`);
}
// Save idempotency key → orderId
async function saveIdempotencyKey(key, orderId) {
    await redis_1.redis.set(`idem:${key}`, orderId, "EX", IDEMPOTENCY_TTL_SECONDS);
}
