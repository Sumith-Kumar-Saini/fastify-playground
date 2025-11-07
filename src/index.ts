import Fastify from 'fastify';
import 'dotenv/config';

const fastify = Fastify({
  logger: true,
});
const PORT = parseInt(process.env.PORT!, 10) || 3000;

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' });
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
