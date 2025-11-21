import { buildApp } from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Ping route', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should return pong', async () => {
    const app = buildApp({
      mongoUri: mongod.getUri(),
      logger: false,
    });

    await app.ready();

    const res = await app.inject({
      method: 'GET',
      url: '/ping',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('pong\n');

    await app.close();
  });
});
