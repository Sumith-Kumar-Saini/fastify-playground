import Fastify from 'fastify';
import logger from './logger';
import routes from './routes';

const fastify = Fastify({ logger: false });
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';

// --- Hooks for request-level logging ---
fastify.addHook('onRequest', (req, _, done) => {
  (req as any).startTime = process.hrtime.bigint();
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  done();
});

fastify.addHook('onResponse', (req, reply, done) => {
  const start = (req as any).startTime as bigint;
  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1_000_000;
  logger.info(
    `Completed ${req.method} ${req.url} -> ${reply.statusCode} (${durationMs.toFixed(2)} ms)`,
  );
  done();
});

// --- Register routes ---
fastify.register(routes);

const start = async () => {
  try {
    logger.info('Starting server initialization...');
    await fastify.listen({ port: PORT, host: HOST });
    logger.info(`Server is listening on http://${HOST}:${PORT}`);
  } catch (err) {
    logger.error(err, 'Server startup failed');
    process.exit(1);
  }
};

void start();
