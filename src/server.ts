import ENV from './configs/env';
import { buildApp } from './app';

const fastify = buildApp();

async function startServer() {
  try {
    await fastify.listen({ port: ENV.PORT, host: ENV.HOST });
  } catch (err) {
    fastify.log.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown handler
async function shutdown(signal: string) {
  try {
    fastify.log.info(`Received ${signal}. Shutting down gracefully...`);
    await fastify.close();
    fastify.log.info('Server closed. Exiting.');
    process.exit(0);
  } catch (err) {
    fastify.log.error({ err }, 'Error during shutdown');
    process.exit(1);
  }
}

// OS signals
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

// Catch unhandled errors
process.on('unhandledRejection', (reason) => {
  fastify.log.error({ reason }, 'Unhandled Rejection');
});

process.on('uncaughtException', (err) => {
  fastify.log.error({ err }, 'Uncaught Exception');
  void shutdown('uncaughtException');
});

void startServer();
