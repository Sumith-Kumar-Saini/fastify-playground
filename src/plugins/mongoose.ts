import * as mongoose from 'mongoose';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export interface MongooseOptions {
  uri: string;
  mongooseOptions?: mongoose.ConnectOptions;
}

async function connectDB(fastify: FastifyInstance, options: MongooseOptions) {
  const { uri, mongooseOptions } = options;
  try {
    const { connection } = await mongoose.connect(uri, mongooseOptions);
    const conn = connection;
    fastify.log.info('MongoDB connected successfully!');
    fastify.decorate('mongo', conn);
    fastify.addHook('onClose', async () => {
      await conn.close().catch((err) => {
        fastify.log.error({ err }, 'Error closing MongoDB connection');
      });
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

export default fp(connectDB, { name: 'fastify-mongoose-plugin' });
