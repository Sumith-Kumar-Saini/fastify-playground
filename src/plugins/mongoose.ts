import { FastifyPluginAsync } from 'fastify';
import * as mongoose from 'mongoose';
import fp from 'fastify-plugin';

export interface MongooseOptions {
  uri: string;
  mongooseOptions?: mongoose.ConnectOptions;
  connectionTimeoutMs?: number; // Timeout option for the connection
  retryAttempts?: number; // Retry attempts in case of failure
}

const connectDB: FastifyPluginAsync<MongooseOptions> = async (fastify, options) => {
  const { uri, mongooseOptions = {}, connectionTimeoutMs = 10000, retryAttempts = 5 } = options;

  let attempt = 0;

  const connect = async () => {
    attempt++;
    try {
      fastify.log.info(`Attempting to connect to MongoDB (Attempt ${attempt})...`);
      const mongooseInstance = await mongoose.connect(uri, {
        ...mongooseOptions,
        serverSelectionTimeoutMS: connectionTimeoutMs, // Apply timeout option
      });

      const conn = mongooseInstance.connection;
      fastify.log.info('MongoDB connected successfully!');
      fastify.decorate('mongo', conn);

      // Handle graceful shutdown
      fastify.addHook('onClose', async () => {
        try {
          await conn.close();
        } catch (err: unknown) {
          fastify.log.error({ err }, 'Error closing MongoDB connection');
        }
      });
    } catch (err: unknown) {
      fastify.log.error({ err }, `Error connecting to MongoDB (Attempt ${attempt})`);

      // Retry logic if connection fails
      if (attempt < retryAttempts) {
        fastify.log.info(`Retrying MongoDB connection...`);
        setTimeout(() => {
          connect().catch((err: unknown) => {
            fastify.log.error({ err }, 'Error reconnecting to MongoDB');
          });
        }, 5000); // Retry after 5 seconds
      } else {
        fastify.log.error('Max retry attempts reached. Shutting down.');
        process.exit(1); // Exit the process after max retries
      }
    }
  };

  await connect();
};

export default fp(connectDB, { name: 'fastify-mongoose-plugin' });
