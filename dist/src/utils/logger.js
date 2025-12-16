"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerOptions = void 0;
const isDev = process.env.NODE_ENV !== "production";
/**
 * Logger configuration for Fastify
 * Fastify will create the Pino instance internally
 */
exports.loggerOptions = isDev
    ? {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname",
            },
        },
    }
    : true; // production: default pino logger
