import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';

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

  afterEach(async () => {
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
  // POST /users
  //
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

    expect(body.name).toBe('John Doe');
    expect(body.email).toBe('john@example.com');
    expect(body._id).toBeDefined();
  });

  //
  // GET /users
  //
  it('should list users (limit default=10)', async () => {
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/users',
    });

    expect(res.statusCode).toBe(200);
    const users = JSON.parse(res.body);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  //
  // GET /users/:userId
  //
  it('should return user by id', async () => {
    // First create a user
    const created = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Jane',
        email: 'jane@example.com',
      },
    });

    const user = JSON.parse(created.body);

    const res = await app.inject({
      method: 'GET',
      url: `/users/${user._id}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body._id).toBe(user._id);
    expect(body.name).toBe('Jane');
  });

  it('should return 404 when user not found', async () => {
    const fakeId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
    const res = await app.inject({
      method: 'GET',
      url: `/users/${fakeId}`,
    });

    expect(res.statusCode).toBe(404);
  });

  //
  // PUT /users/:userId
  //
  it('should update a user', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Bob',
        email: 'bob@example.com',
      },
    });

    const user = JSON.parse(created.body);

    const res = await app.inject({
      method: 'PUT',
      url: `/users/${user._id}`,
      payload: {
        name: 'Bob Updated',
      },
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(body.name).toBe('Bob Updated');
  });

  it('should return 404 when updating non-existing user', async () => {
    const fakeId = 'bbbbbbbbbbbbbbbbbbbbbbbb';
    const res = await app.inject({
      method: 'PUT',
      url: `/users/${fakeId}`,
      payload: { name: 'Nobody' },
    });

    expect(res.statusCode).toBe(404);
  });

  //
  // DELETE /users/:userId
  //
  it('should delete a user', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Delete Me',
        email: 'deleteme@example.com',
      },
    });

    const user = JSON.parse(created.body);

    const res = await app.inject({
      method: 'DELETE',
      url: `/users/${user._id}`,
    });

    expect(res.statusCode).toBe(200);
  });

  it('should return 404 when deleting non-existing user', async () => {
    const fakeId = 'cccccccccccccccccccccccc';

    const res = await app.inject({
      method: 'DELETE',
      url: `/users/${fakeId}`,
    });

    expect(res.statusCode).toBe(404);
  });
});
