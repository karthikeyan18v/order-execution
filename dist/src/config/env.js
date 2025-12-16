"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load .env into process.env
dotenv_1.default.config();
// Define required environment variables
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("3000"),
    NODE_ENV: zod_1.z.string().default("development"),
    DATABASE_URL: zod_1.z.string().optional(),
    REDIS_URL: zod_1.z.string().default("redis://localhost:6379"),
});
// Validate environment variables at startup
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables", parsed.error.format());
    process.exit(1);
}
// Export validated env
exports.env = {
    PORT: Number(parsed.data.PORT),
    NODE_ENV: parsed.data.NODE_ENV,
    DATABASE_URL: parsed.data.DATABASE_URL,
    REDIS_URL: parsed.data.REDIS_URL,
};
