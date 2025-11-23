import { FastifyPluginCallback } from 'fastify';
import { createUserModel, IUserDoc } from '../models/user';
import { Model } from 'mongoose';
import fp from 'fastify-plugin';

export interface Models {
  User: Model<IUserDoc>;
}

const modelsPlugin: FastifyPluginCallback = (fastify) => {
  const models = {
    User: createUserModel(fastify.mongo),
  };

  fastify.decorate('models', models);
};

export default fp(modelsPlugin, {
  name: 'models-plugin',
});
