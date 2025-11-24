import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { healthCheckResponseSchema } from './health.schema';
import { handler } from './health.controller';

const routes: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get(
    '/health',
    {
      schema: {
        response: {
          200: healthCheckResponseSchema,
          503: healthCheckResponseSchema,
          500: healthCheckResponseSchema,
        },
      },
    },
    handler,
  );
};

export default routes;
