import { FastifyInstance } from "fastify";
import { healthRoutes } from "./health";
import { orderController } from "./modules/orders/order.controller";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(orderController);
}
