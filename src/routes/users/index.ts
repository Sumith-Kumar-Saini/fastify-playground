import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { QueryLimitSchema, UserListResponseSchema } from './user.schema';
import { getAllUsers } from './user.controller';
import { ErrorSchema } from '../../schemas/error.schema';

const routes: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get(
    '/users',
    {
      schema: {
        querystring: QueryLimitSchema,
        response: {
          200: UserListResponseSchema,
          500: ErrorSchema,
        },
      },
    },
    getAllUsers,
  );

  done();
};

export default routes;
