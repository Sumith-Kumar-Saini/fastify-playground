import Fastify from 'fastify';
import logger from './utils/logger-config';
import routes from './routes/users';
import modelsPlugin from './plugins/models';
import mongoPlugin from './plugins/mongoose';
import ENV from './configs/env';

export function buildApp(overrides: { mongoUri?: string; logger?: boolean } = { logger: true }) {
  const fastify = Fastify({
    logger: overrides?.logger ?? logger,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
      },
    },
  });

  // Ping route
  fastify.get('/ping', () => 'pong\n');

  // Register plugins with fallback for mongoUri
  const mongoUri = overrides?.mongoUri ?? ENV.MONGO_URI;
  if (!mongoUri) {
    fastify.log.error('Mongo URI is not defined!');
    process.exit(1);
  }
  fastify.register(mongoPlugin, { uri: mongoUri });
  fastify.register(modelsPlugin);

  // Register routes
  fastify.register(routes);

  return fastify;
}
