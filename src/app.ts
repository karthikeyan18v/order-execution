import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { loggerOptions } from "./utils/logger";
import { registerRoutes } from "./routes";

// Create Fastify app
export const app = Fastify({
  logger: loggerOptions,
});

// Register WebSocket plugin
app.register(websocket);

// Register routes
registerRoutes(app);
