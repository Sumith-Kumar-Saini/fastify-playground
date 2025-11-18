import { FastifyRequest, FastifyReply } from 'fastify';
import { IUser } from '../../models/user';

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { User } = request.server.models;

    const limitParam: string | undefined = (request.query as any).limit;
    const limit = Math.min(parseInt(limitParam!, 10) || 10, 50);
    const users = await User.find({}).limit(limit).lean();
    return users;
  } catch (err) {
    request.server.log.error(err);
    reply.status(500);
    return {
      message: 'Internal server error.',
      status: reply.statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { User } = request.server.models;
    const { name, email }: { name: string; email: string } = request.body as any;
    const user = new User<IUser>({ name, email });
    await user.save();
    reply.status(201);
    return user;
  } catch (err) {
    request.server.log.error(err);
    reply.status(500);
    return {
      message: 'Internal server error',
      status: reply.statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}
