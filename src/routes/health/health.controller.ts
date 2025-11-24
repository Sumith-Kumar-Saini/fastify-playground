import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { checkDbConnection } from '../../utils/healthCheck';

export interface HealthCheckResponse {
  failedServices: string[] | null;
  succeededServices: string[] | null;
}

type ConnectionCheck = (fastify: FastifyInstance) => Promise<boolean>;
type Connections = Record<string, ConnectionCheck>;

export async function checkHealth(fastify: FastifyInstance): Promise<HealthCheckResponse> {
  const connections: Connections = {
    MongoDB: checkDbConnection,
  };

  const failed: string[] = [];
  const succeeded: string[] = [];

  const checks = Object.keys(connections).map(async (key) => {
    const check = connections[key];
    const status = await check(fastify);
    if (!status) {
      failed.push(key);
    } else {
      succeeded.push(key);
    }
  });

  await Promise.all(checks);

  return {
    failedServices: failed.length > 0 ? failed : null,
    succeededServices: succeeded.length > 0 ? succeeded : null,
  };
}

export const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { failedServices, succeededServices } = await checkHealth(request.server);

    if (failedServices === null) {
      reply.status(200).send({
        status: 'OK',
        message: 'All services are running smoothly.',
        services: { succeededServices, failedServices: null },
      });
    } else {
      reply.status(503).send({
        status: 'FAIL',
        message: `The following services failed: ${failedServices.join(', ')}`,
        services: { failedServices, succeededServices },
      });
    }
  } catch (error) {
    request.server.log.error({ error }, 'Health check failed');
    reply.status(500).send({
      status: 'FAIL',
      message: 'An error occurred during the health check.',
    });
  }
};
