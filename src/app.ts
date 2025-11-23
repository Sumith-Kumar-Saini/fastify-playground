import Fastify from 'fastify';
import { getLoggerConfig } from './utils/logger-config';
import routes from './routes/users';
import modelsPlugin from './plugins/models';
import mongoPlugin from './plugins/mongoose';
import ENV from './configs/env';

export function buildApp(
  overrides: { mongoUri?: string; logger?: boolean | object } = { logger: true },
) {
  const loggerConfig = getLoggerConfig(overrides);
  const fastify = Fastify({
    logger: loggerConfig,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
      },
    },
  });

  // Welcome route
  fastify.get(
    '/',
    () => 'Welcome to the Fastify Playground! Explore, experiment, and learn the power of Fastify.',
  );

  // Ping route
  fastify.get('/ping', () => 'pong\n');

  // Register plugins
  fastify.register(mongoPlugin, { uri: overrides?.mongoUri ?? ENV.MONGO_URI });
  fastify.register(modelsPlugin);

  // Register routes
  fastify.register(routes);

  return fastify;
}
