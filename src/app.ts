import Fastify from 'fastify';
import fastifyJWT from '@fastify/jwt';
import logger from './utils/logger-config';
import UserRoutes from './routes/users';
import HealthRoutes from './routes/health';
import modelsPlugin from './plugins/models';
import mongoPlugin from './plugins/mongoose';
import ENV from './configs/env';
import { customErrorHandler } from './utils/error-hander';

export function buildApp(overrides: { mongoUri?: string; logger?: boolean } = { logger: true }) {
  const fastify = Fastify({
    logger: overrides?.logger ?? logger,
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
  fastify.register(fastifyJWT, { secret: ENV.JWT_SECRET });

  // Register routes
  fastify.register(UserRoutes);
  fastify.register(HealthRoutes);

  fastify.setErrorHandler(customErrorHandler);

  return fastify;
}
