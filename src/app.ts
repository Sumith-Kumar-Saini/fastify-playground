import Fastify from 'fastify';
import ENV from './configs/env';
import logger from './utils/logger-config';
import routes from './routes/users';
import mongoPlugin from './plugins/mongoose';
import modelsPlugin from './plugins/models';

export function buildApp() {
  const fastify = Fastify({
    logger,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
      },
    },
  });

  // Ping route
  fastify.get('/ping', () => 'pong\n');

  // Register plugins
  fastify.register(mongoPlugin, { uri: ENV.MONGO_URI });
  fastify.register(modelsPlugin);

  // Register routes
  fastify.register(routes);

  return fastify;
}
