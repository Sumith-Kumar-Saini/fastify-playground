import { FastifyInstance } from 'fastify';

export async function createTestUser(app: FastifyInstance, overrides: Record<string, any> = {}) {
  const payload = {
    name: 'Test User',
    email: `user${Math.floor(Math.random() * 100000)}@example.com`,
    ...overrides,
  };

  const res = await app.inject({
    method: 'POST',
    url: '/users',
    payload,
  });

  if (res.statusCode !== 201) {
    throw new Error(`Failed to create user: ${res.body}`);
  }

  type User = {
    _id: string;
    name: string;
    email: string;
    [key: string]: unknown;
  };

  const parsed = JSON.parse(res.body) as unknown;
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`Invalid response body: ${res.body}`);
  }

  const user = parsed as User;
  if (
    typeof user._id !== 'string' ||
    typeof user.name !== 'string' ||
    typeof user.email !== 'string'
  ) {
    throw new Error(`Response body does not match User shape: ${res.body}`);
  }

  return user;
}
