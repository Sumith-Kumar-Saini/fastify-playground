import Fastify from 'fastify';
import ENV from './configs/env';
import logger from './utils/logger-config';
import routes from './routes/users';
import mongoPlugin from './plugins/mongoose';
import modelsPlugin from './plugins/models';

const fastify = Fastify({ logger });

// --- Ping Route ----
fastify.get('/ping', () => 'pong\n');

// --- Register Database / Models ---
fastify.register(mongoPlugin, { uri: ENV.MONGO_URI });
fastify.register(modelsPlugin);

// --- Register routes ---
fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: ENV.PORT, host: ENV.HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
