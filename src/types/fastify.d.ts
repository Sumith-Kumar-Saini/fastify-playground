import * as mongoose from 'mongoose';

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: typeof mongoose;
  }
}
