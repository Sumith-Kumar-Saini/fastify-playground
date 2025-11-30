import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  QueryLimitSchema,
  UserListResponseSchema,
  UserSchema as UserResponseSchema,
  UserIdParamSchema,
  CreateUserBodySchema,
  UpdateUserBodySchema,
  UserTokenResponseSchema,
} from './user.schema';
import { ErrorSchema } from '../../schemas/error.schema';
import {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  type GetUsersQuery,
  type ParamUserId,
  type CreateUserBody,
  type EditUserBody,
} from './user.controller';

const routes: FastifyPluginCallback = (fastify: FastifyInstance, _opts, done) => {
  // list users
  fastify.get<{ Querystring: GetUsersQuery }>(
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
    getUsers,
  );

  // create user
  fastify.post<{ Body: CreateUserBody }>(
    '/users',
    {
      schema: {
        body: CreateUserBodySchema,
        response: {
          201: UserTokenResponseSchema,
          400: ErrorSchema,
          409: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    createUser,
  );

  // get single user
  fastify.get<{ Params: ParamUserId }>(
    '/users/:userId',
    {
      schema: {
        params: UserIdParamSchema,
        response: {
          200: UserTokenResponseSchema,
          404: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    getUserById,
  );

  // update user
  fastify.put<{ Params: ParamUserId; Body: EditUserBody }>(
    '/users/:userId',
    {
      schema: {
        params: UserIdParamSchema,
        body: UpdateUserBodySchema,
        response: {
          200: UserResponseSchema,
          400: ErrorSchema,
          404: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    updateUserById,
  );

  // delete user
  fastify.delete<{ Params: ParamUserId }>(
    '/users/:userId',
    {
      schema: {
        params: UserIdParamSchema,
        response: {
          200: UserResponseSchema,
          404: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    deleteUserById,
  );

  done();
};

export default routes;
