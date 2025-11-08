import { FastifyInstance, FastifyPluginCallback } from 'fastify';

const routes: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/', () => {
    return { hello: 'world' };
  });
  done();
};

export default routes;
