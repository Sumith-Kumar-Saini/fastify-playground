import { FastifyInstance, FastifyPluginCallback } from 'fastify';

const routes: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  const { User } = fastify.models;
  fastify.get('/users', (request, reply) => {
    try {
      const { limit: _limit }: { limit?: string } = request.query || {};
      const limit = _limit ? 10 : Math.min(parseInt(_limit!, 10), 50);
      const users = User.find({}).limit(limit).lean();
      return users;
    } catch (err) {
      fastify.log.error(err);
      reply.status(500);
      return { message: "Can't get users", code: 500 };
    }
  });

  done();
};

export default routes;
