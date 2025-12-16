"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgPool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
// Create PostgreSQL connection pool
exports.pgPool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
});
// Test connection at startup
exports.pgPool
    .query("SELECT 1")
    .then(() => console.log("✅ PostgreSQL connected"))
    .catch((err) => {
    console.error("❌ PostgreSQL connection failed", err);
    process.exit(1);
});
