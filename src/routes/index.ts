import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { User } from '../models/user';

const routes: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/users', (request, reply) => {
    try {
      const limit = request.query;
      fastify.log.info(limit);
      const users = User.find({}).limit(10).lean();
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
