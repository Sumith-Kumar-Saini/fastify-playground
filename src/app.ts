import Fastify from 'fastify';
import logger from './utils/logger-config';
import routes from './routes/users';
import modelsPlugin from './plugins/models';
import mongoPlugin from './plugins/mongoose';
import ENV from './configs/env';

export function buildApp(overrides?: { mongoUri?: string }) {
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
  fastify.register(mongoPlugin, { uri: overrides?.mongoUri ?? ENV.MONGO_URI });
  fastify.register(modelsPlugin);

  // Register routes
  fastify.register(routes);

  return fastify;
}
