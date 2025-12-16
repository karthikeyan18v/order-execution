import { Pool } from "pg";
import { env } from "./env";

// Create PostgreSQL connection pool
export const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Test connection at startup
pgPool
  .query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed", err);
    process.exit(1);
  });
