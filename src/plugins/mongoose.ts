import { FastifyPluginAsync } from 'fastify';
import * as mongoose from 'mongoose';
import fp from 'fastify-plugin';

export interface MongooseOptions {
  uri: string;
  mongooseOptions?: mongoose.ConnectOptions;
}

const connectDB: FastifyPluginAsync<MongooseOptions> = async (fastify, options) => {
  const { uri, mongooseOptions } = options;
  try {
    const mongooseInstance = await mongoose.connect(uri, mongooseOptions);
    const conn = mongooseInstance.connection;
    fastify.log.info('MongoDB connected successfully!');
    fastify.decorate('mongo', conn);
    fastify.addHook('onClose', async () => {
      try {
        await conn.close();
      } catch (err: unknown) {
        fastify.log.error({ err }, 'Error closing MongoDB connection');
      }
    });
  } catch (err: unknown) {
    fastify.log.error({ err }, 'Error connecting to MongoDB');
    process.exit(1);
  }
};

export default fp(connectDB, { name: 'fastify-mongoose-plugin' });
