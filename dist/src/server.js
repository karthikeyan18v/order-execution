"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
// Start server
const start = async () => {
    try {
        await app_1.app.listen({ port: env_1.env.PORT, host: "0.0.0.0" });
        app_1.app.log.info(`🚀 Server running on port ${env_1.env.PORT}`);
    }
    catch (err) {
        app_1.app.log.error(err, "❌ Failed to start server");
        process.exit(1);
    }
};
start();
// Start worker
require("./modules/orders/order.worker");
