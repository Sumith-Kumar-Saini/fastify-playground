import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

const fastify: FastifyInstance = Fastify({ logger: false });
const port = 3001;

fastify.get('/test', async (_, __) => 'Hello from Fastify!');

fastify.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Fastify server listening on ${address}`);
});

export default fastify;
