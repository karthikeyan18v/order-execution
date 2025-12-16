const isDev = process.env.NODE_ENV !== "production";

/**
 * Logger configuration for Fastify
 * Fastify will create the Pino instance internally
 */
export const loggerOptions = isDev
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
