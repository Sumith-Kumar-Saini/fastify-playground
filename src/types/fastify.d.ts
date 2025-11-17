import { Connection } from 'mongoose';
import { Models } from '../plugins/models';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: Connection;
    models: Models;
  }
}
