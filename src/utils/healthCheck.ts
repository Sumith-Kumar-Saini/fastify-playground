import { FastifyInstance } from 'fastify';

export async function checkDbConnection(fastify: FastifyInstance): Promise<boolean> {
  const db = fastify.mongo;
  try {
    await db.db?.admin().ping();
    fastify.log.info('MongoDB connection is healthy');
    return true;
  } catch (error) {
    fastify.log.error({ error }, 'MongoDB connection failed');
    return false;
  }
}
