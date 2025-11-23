import 'dotenv/config';

const _config = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fastify',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

const isTest = process.env.NODE_ENV === 'testing';

const ENV = isTest ? _config : Object.freeze(_config);

export type IENV = typeof ENV;

export default ENV;
