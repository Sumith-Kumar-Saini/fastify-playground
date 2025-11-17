import { UserSchema } from '../../schemas/user.schema';

export const QueryLimitSchema = {
  type: 'object',
  properties: {
    limit: { type: 'string', pattern: '^[0-9]+$' },
  },
} as const;

export const UserListResponseSchema = {
  type: 'array',
  items: UserSchema,
} as const;
