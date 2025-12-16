"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
const redis_1 = require("./config/redis");
const postgres_1 = require("./config/postgres");
async function healthRoutes(app) {
    app.get("/health", async () => {
        // Simple health check
        await redis_1.redis.ping();
        await postgres_1.pgPool.query("SELECT 1");
        return {
            status: "ok",
            redis: "connected",
            database: "connected",
        };
    });
}
