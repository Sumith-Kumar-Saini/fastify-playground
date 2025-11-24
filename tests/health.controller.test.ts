import { checkHealth } from '../src/routes/health/health.controller';
import { checkDbConnection } from '../src/utils/healthCheck';
import { FastifyInstance } from 'fastify';

jest.mock('../src/utils/healthCheck', () => ({
  checkDbConnection: jest.fn(),
}));

describe('checkHealth controller', () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    fastify = { log: { info: jest.fn(), error: jest.fn() } } as unknown as FastifyInstance;
    jest.resetAllMocks();
  });

  it('returns healthy when MongoDB connection succeeds', async () => {
    (checkDbConnection as jest.Mock).mockResolvedValue(true);

    const result = await checkHealth(fastify);

    expect(checkDbConnection).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      failedServices: null,
      succeededServices: ['MongoDB'],
    });
  });

  it('returns unhealthy when MongoDB connection fails', async () => {
    (checkDbConnection as jest.Mock).mockResolvedValue(false);

    const result = await checkHealth(fastify);

    expect(result).toEqual({
      failedServices: ['MongoDB'],
      succeededServices: null,
    });
  });

  it('bubbles up unexpected errors', async () => {
    (checkDbConnection as jest.Mock).mockRejectedValue(new Error('boom'));

    await expect(checkHealth(fastify)).rejects.toThrow('boom');
  });
});
