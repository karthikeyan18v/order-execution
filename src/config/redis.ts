import IORedis from "ioredis";
import { env } from "./env";

export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
  enableReadyCheck: false,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});
