import { setupTestApp, teardownTestApp } from './setup';
import { FastifyInstance } from 'fastify';
import { createTestUser } from './factories/userFactory';

describe('Users routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await teardownTestApp();
  });

  //
  // CREATE USER
  //
  describe('POST /users', () => {
    it('should create a user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.email).toBe('john@example.com');
    });

    it('should return 409 on duplicate email', async () => {
      const email = 'dup@example.com';
      await createTestUser(app, { email });

      const res = await app.inject({
        method: 'POST',
        url: '/users',
        payload: { name: 'Someone Else', email },
      });

      expect(res.statusCode).toBe(409);
    });

    it('should return 400 for invalid email', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Bad Email',
          email: 'not-an-email',
        },
      });

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when name is missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          email: 'no-name@example.com',
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  //
  // GET LIST
  //
  describe('GET /users', () => {
    it('should list users', async () => {
      await createTestUser(app);

      const res = await app.inject({
        method: 'GET',
        url: '/users',
      });

      expect(res.statusCode).toBe(200);
      const list = JSON.parse(res.body);
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    });

    it('should validate limit query (400)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/users?limit=abc',
      });

      // Query schema pattern /^[0-9]+$/ so invalid → 400
      expect(res.statusCode).toBe(400);
    });
  });

  //
  // GET BY ID
  //
  describe('GET /users/:id', () => {
    it('should return a user', async () => {
      const user = await createTestUser(app);

      const res = await app.inject({
        method: 'GET',
        url: `/users/${user._id}`,
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body._id).toBe(user._id);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/users/not-a-valid-id',
      });

      expect(res.statusCode).toBe(400);
    });

    it('should return 404 for non-existing user', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/users/aaaaaaaaaaaaaaaaaaaaaaaa',
      });

      expect(res.statusCode).toBe(404);
    });
  });

  //
  // UPDATE
  //
  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const user = await createTestUser(app);

      const res = await app.inject({
        method: 'PUT',
        url: `/users/${user._id}`,
        payload: { name: 'Updated Name' },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.name).toBe('Updated Name');
    });

    it('should return 400 for invalid email on update', async () => {
      const user = await createTestUser(app);

      const res = await app.inject({
        method: 'PUT',
        url: `/users/${user._id}`,
        payload: { email: 'bad-email' },
      });

      expect(res.statusCode).toBe(400);
    });

    it('should return 404 when updating non-existing user', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: `/users/bbbbbbbbbbbbbbbbbbbbbbbb`,
        payload: { name: 'None' },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  //
  // DELETE
  //
  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const user = await createTestUser(app);

      const res = await app.inject({
        method: 'DELETE',
        url: `/users/${user._id}`,
      });

      expect(res.statusCode).toBe(200);
    });

    it('should return 404 when deleting a non-existing user', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/users/cccccccccccccccccccccccc',
      });

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/users/invalid-id',
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
