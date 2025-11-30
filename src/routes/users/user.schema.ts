import { UserSchema } from '../../schemas/user.schema';
export { UserSchema } from '../../schemas/user.schema';

export const QueryLimitSchema = {
  type: 'object',
  properties: {
    limit: { type: 'string', pattern: '^[0-9]+$' },
    page: { type: 'string', pattern: '^[0-9]+$' },
  },
} as const;

export const UserListResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: UserSchema, // List of users
    },
    meta: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        limit: { type: 'integer' },
        totalUsers: { type: 'integer' },
        totalPages: { type: 'integer' },
      },
      required: ['page', 'limit', 'totalUsers', 'totalPages'],
    },
  },
  required: ['data', 'meta'],
} as const;

export const UserIdParamSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      minLength: 24,
      pattern: '^[0-9a-fA-F]{24}$',
    },
  },
  required: ['userId'],
} as const;

export const CreateUserBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
  required: ['name', 'email'],
} as const;

export const UpdateUserBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
} as const;

export const UserTokenResponseSchema = {
  type: 'object',
  properties: {
    user: UserSchema,
    token: { type: 'string' },
  },
  required: ['user', 'token'],
};
