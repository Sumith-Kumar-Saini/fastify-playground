import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

const buildApp = (PORT: number = 3001): Promise<FastifyInstance> => {
  const fastify: FastifyInstance = Fastify({ logger: false });

  fastify.get('/test', async (_, __) => 'Hello from Fastify!');

  return new Promise((resolve, reject) => {
    fastify.listen({ port: PORT }, (err, address) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`Fastify server listening on ${address}`);
        resolve(fastify);
      }
    });
  });
};

export default buildApp;
