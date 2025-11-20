import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { QueryLimitSchema, UserListResponseSchema } from './user.schema';
import { createUser, getAllUsers, editUser } from './user.controller';
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
          400: ErrorSchema,
          409: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    createUser,
  );

  fastify.put(
    '/users/:userId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              minLength: 24,
              pattern: '^[0-9a-fA-F]{24}$',
            },
          },
          required: ['userId'],
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    editUser,
  );

  done();
};

export default routes;
