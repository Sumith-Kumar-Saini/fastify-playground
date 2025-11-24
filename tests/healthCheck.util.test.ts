import { FastifyInstance } from 'fastify';
import { checkDbConnection } from '../src/utils/healthCheck';

describe('checkDbConnection utility', () => {
  interface MockFastify {
    mongo: {
      db: {
        admin: () => {
          ping: jest.Mock;
        };
      };
    };
    log: {
      info: jest.Mock;
      error: jest.Mock;
    };
  }

  const adminObject = {
    ping: jest.fn(),
  };

  const mockFastify: MockFastify = {
    mongo: {
      db: {
        admin: () => adminObject,
      },
    },
    log: {
      info: jest.fn(),
      error: jest.fn(),
    },
  };

  beforeEach(() => {
    adminObject.ping.mockReset();
    mockFastify.log.info.mockReset();
    mockFastify.log.error.mockReset();
  });

  it('returns true when MongoDB ping succeeds', async () => {
    adminObject.ping.mockResolvedValue({ ok: 1 });

    const result = await checkDbConnection(mockFastify as unknown as FastifyInstance);

    expect(result).toBe(true);
    expect(mockFastify.log.info).toHaveBeenCalled();
  });

  it('returns false when MongoDB ping fails', async () => {
    adminObject.ping.mockRejectedValue(new Error('fail'));

    const result = await checkDbConnection(mockFastify as unknown as FastifyInstance);

    expect(result).toBe(false);
    expect(mockFastify.log.error).toHaveBeenCalled();
  });
});
