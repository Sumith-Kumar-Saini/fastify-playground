import * as mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

const uri = process.env.DB_URI || 'mongodb://localhost:27017/fastify';

async function connectDB(fastify: FastifyInstance) {
  try {
    await mongoose.connect(uri);
    fastify.log.info('MongoDB connected successfully!');
    fastify.decorate('mongoose', mongoose);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

export { connectDB };
