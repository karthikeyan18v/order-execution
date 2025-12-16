"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const health_1 = require("./health");
const order_controller_1 = require("./modules/orders/order.controller");
async function registerRoutes(app) {
    await app.register(health_1.healthRoutes);
    await app.register(order_controller_1.orderController);
}
