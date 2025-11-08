import Fastify from 'fastify';
import logger from './utils/logger-config';
import routes from './routes';

const fastify = Fastify({ logger });
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';

// --- Ping Route ----
fastify.get('/ping', () => 'pong\n');

// --- Register routes ---
fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
