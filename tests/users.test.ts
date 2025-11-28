import { FastifyInstance } from 'fastify';
import { createTestUser, createTestUsers } from './factories/userFactory';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { buildApp } from '../src/app';

describe('Users routes', () => {
  let mongod: MongoMemoryServer;
  let app: FastifyInstance;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    app = buildApp({
      mongoUri: mongod.getUri(),
      logger: false,
    });

    await app.ready();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
    await mongod.stop();
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
  // GET LIST WITH PAGINATION
  //
  describe('GET /users', () => {
    it('should list users with pagination', async () => {
      await createTestUsers(app, 20);

      const res = await app.inject({
        method: 'GET',
        url: '/users?page=1&limit=10',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBe(10);
      expect(body.meta.page).toBe(1);
      expect(body.meta.limit).toBe(10);
      expect(body.meta.totalUsers).toBe(20);
      expect(body.meta.totalPages).toBe(2);
    });

    it('should return 400 for invalid limit query', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/users?limit=abc',
      });

      expect(res.statusCode).toBe(400);
    });

    it('should return the correct number of users for page 2', async () => {
      await createTestUsers(app, 20);

      const res = await app.inject({
        method: 'GET',
        url: '/users?page=2&limit=10',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.length).toBe(10);
      expect(body.meta.page).toBe(2);
      expect(body.meta.limit).toBe(10);
      expect(body.meta.totalUsers).toBe(20);
      expect(body.meta.totalPages).toBe(2);
    });

    it('should return an empty array for out-of-bounds page', async () => {
      await createTestUsers(app, 20);

      const res = await app.inject({
        method: 'GET',
        url: '/users?page=3&limit=10',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.length).toBe(0);
      expect(body.meta.page).toBe(3);
      expect(body.meta.totalUsers).toBe(20);
      expect(body.meta.totalPages).toBe(2);
    });

    it('should return 400 for invalid page query', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/users?page=not-a-number&limit=10',
      });

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
