import { FastifyInstance } from 'fastify';

function routes(fastify: FastifyInstance) {
  fastify.get('/', () => {
    return { hello: 'world' };
  });
}

export default routes;
