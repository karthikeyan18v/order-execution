"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const logger_1 = require("./utils/logger");
const routes_1 = require("./routes");
// Create Fastify app
exports.app = (0, fastify_1.default)({
    logger: logger_1.loggerOptions,
});
// Register WebSocket plugin
exports.app.register(websocket_1.default);
// Register routes
(0, routes_1.registerRoutes)(exports.app);
