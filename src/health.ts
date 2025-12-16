import { FastifyInstance } from "fastify";
import { redis } from "./config/redis";
import { pgPool } from "./config/postgres";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    // Simple health check
    await redis.ping();
    await pgPool.query("SELECT 1");

    return {
      status: "ok",
      redis: "connected",
      database: "connected",
    };
  });
}
