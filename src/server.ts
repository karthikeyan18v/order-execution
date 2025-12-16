import { app } from "./app";
import { env } from "./config/env";

// Start server
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info(`🚀 Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err, "❌ Failed to start server");
    process.exit(1);
  }
};

start();

// Start worker
import "./modules/orders/order.worker";
