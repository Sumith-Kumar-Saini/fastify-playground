import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { QueryLimitSchema, UserListResponseSchema } from './user.schema';
import { createUser, getAllUsers } from './user.controller';
import { ErrorSchema } from '../../schemas/error.schema';
import { UserSchema } from '../../schemas/user.schema';

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

  fastify.post(
    '/users',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
          required: ['name', 'email'],
        },
        response: {
          201: UserSchema,
          500: ErrorSchema,
        },
      },
    },
    createUser,
  );

  done();
};

export default routes;
