import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

let mongod: MongoMemoryServer;
let app: FastifyInstance;

export async function setupTestApp() {
  mongod = await MongoMemoryServer.create();

  app = buildApp({
    mongoUri: mongod.getUri(),
    logger: false,
  });

  await app.ready();
  return app;
}

export async function teardownTestApp() {
  await app.close();
  await mongoose.connection.close();
  await mongod.stop();
}
