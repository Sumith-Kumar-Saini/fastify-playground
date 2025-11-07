import Fastify from 'fastify';
import 'dotenv/config';

const fastify = Fastify({
  logger: false,
});
const PORT = parseInt(process.env.PORT!, 10) || 3000;

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' });
});

fastify.listen({ port: PORT }, function (err, _) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log('Server listening at http://localhost:' + PORT);
});
