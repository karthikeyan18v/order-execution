import dotenv from "dotenv";
import { z } from "zod";

// Load .env into process.env
dotenv.config();

// Define required environment variables
const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
});

// Validate environment variables at startup
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables", parsed.error.format());
  process.exit(1);
}

// Export validated env
export const env = {
  PORT: Number(parsed.data.PORT),
  NODE_ENV: parsed.data.NODE_ENV,
  DATABASE_URL: parsed.data.DATABASE_URL,
  REDIS_URL: parsed.data.REDIS_URL,
};
