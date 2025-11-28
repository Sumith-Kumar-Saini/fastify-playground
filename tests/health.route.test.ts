import * as healthCheck from '../src/utils/healthCheck';
import { FastifyInstance } from 'fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { buildApp } from '../src/app';
import mongoose from 'mongoose';

jest.mock('../src/utils/healthCheck');

describe('/health route', () => {
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

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
    await mongod.stop();
  });

  it('returns 200 OK when all services are healthy', async () => {
    jest.spyOn(healthCheck, 'checkDbConnection').mockResolvedValue(true);

    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(200);

    const json = res.json();
    expect(json.status).toBe('OK');
    expect(json.services.succeededServices).toEqual(['MongoDB']);
    expect(json.services.failedServices).toBeNull();
  });

  it('returns 503 FAIL when a service is unhealthy', async () => {
    jest.spyOn(healthCheck, 'checkDbConnection').mockResolvedValue(false);

    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(503);

    const json = res.json();
    expect(json.status).toBe('FAIL');
    expect(json.services.failedServices).toEqual(['MongoDB']);
    expect(json.services.succeededServices).toBeNull();
  });

  it('returns 500 on internal error', async () => {
    jest.spyOn(healthCheck, 'checkDbConnection').mockRejectedValue(new Error('unexpected'));

    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(500);

    expect(res.json()).toEqual({
      status: 'FAIL',
      message: 'An error occurred during the health check.',
    });
  });
});
