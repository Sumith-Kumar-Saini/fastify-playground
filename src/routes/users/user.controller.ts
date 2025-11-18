import { FastifyRequest, FastifyReply } from 'fastify';
import { IUser } from '../../models/user';
import { Error as MongooseError } from 'mongoose';

// 1. Define types for clarity
interface IGetAllUsersQuery {
  limit?: string;
}

interface ICreateUserBody {
  name: string;
  email: string;
}

// --- Controller for fetching all users ---

export async function getAllUsers(
  request: FastifyRequest<{ Querystring: IGetAllUsersQuery }>,
  reply: FastifyReply,
) {
  try {
    const { User } = request.server.models;

    const limitParam = request.query.limit;
    const limit = Math.min(Math.max(parseInt(limitParam || '10', 10), 1), 50);

    const users = await User.find({}).limit(limit).lean();
    return users;
  } catch (err) {
    request.server.log.error(err);
    reply.status(500).send({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      error: 'Internal Server Error',
      message: 'An unexpected server error occurred while fetching users.',
    });
  }
}

// --- Controller for creating a user ---

export async function createUser(
  request: FastifyRequest<{ Body: ICreateUserBody }>,
  reply: FastifyReply,
) {
  try {
    const { User } = request.server.models;
    const { name, email } = request.body;

    const user = new User<IUser>({ name, email });
    await user.save();

    reply.status(201).send(user);
  } catch (err) {
    request.server.log.error(err);
    if (err instanceof MongooseError.CastError || (err as any).code === 11000) {
      reply.status(409).send({
        statusCode: 409,
        code: 'DUPLICATE_RESOURCE',
        error: 'Conflict',
        message: 'A user with this email address already exists.',
      });
      return;
    }

    reply.status(500).send({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      error: 'Internal Server Error',
      message: 'An unexpected server error occurred while creating the user.',
    });
  }
}
