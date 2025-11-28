import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { Model } from 'mongoose';
import { IUserDoc } from '../../models/user';
import { sanitizePagination } from '../../utils/pagination-helper';
import { getPaginatedUsers } from '../../services/user';

type ServerWithModels = FastifyInstance & {
  models: {
    User: Model<IUserDoc>;
  };
};

type RequestWithModels<T extends RouteGenericInterface> = FastifyRequest<T> & {
  server: ServerWithModels;
};

export interface GetUsersQuery {
  limit?: string;
  page?: string;
}

export interface CreateUserBody {
  name: string;
  email: string;
}

export interface EditUserBody {
  name?: string;
  email?: string;
}

export interface ParamUserId {
  userId: string;
}

/**
 * Utility: standard error response body factory
 */
function makeErrorResponse(statusCode: number, code: string, error: string, message: string) {
  return { statusCode, code, error, message };
}

/**
 * GET /users
 */
export async function getUsers(
  request: RequestWithModels<{ Querystring: GetUsersQuery }>,
  reply: FastifyReply,
) {
  const { User } = request.server.models;

  try {
    const { page, limit } = sanitizePagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    const results = await getPaginatedUsers({ page, limit }, User);
    return reply.code(200).send(results);
  } catch (err) {
    // Catch invalid pagination errors and return a 400
    if (err instanceof Error && err.message.includes('must be positive integers')) {
      return reply
        .code(400)
        .send(
          makeErrorResponse(
            400,
            'BAD_REQUEST',
            'Invalid Pagination',
            'Page and limit must be positive integers.',
          ),
        );
    }

    // Catch all other errors
    request.server.log.error(err);
    return reply
      .code(500)
      .send(
        makeErrorResponse(
          500,
          'INTERNAL_SERVER_ERROR',
          'Internal Server Error',
          'An unexpected server error occurred while fetching users.',
        ),
      );
  }
}

/**
 * GET /users/:userId
 */
export async function getUserById(
  request: RequestWithModels<{ Params: ParamUserId }>,
  reply: FastifyReply,
) {
  const { User } = request.server.models;
  const { userId } = request.params;

  try {
    const user = await User.findById(userId).lean().exec();
    if (!user) {
      return reply
        .code(404)
        .send(
          makeErrorResponse(
            404,
            'NOT_FOUND',
            'User Not Found',
            'The requested user resource could not be found.',
          ),
        );
    }
    return reply.code(200).send(user);
  } catch (err) {
    request.server.log.error(err);
    return reply
      .code(500)
      .send(
        makeErrorResponse(
          500,
          'INTERNAL_SERVER_ERROR',
          'Internal Server Error',
          'An unexpected server error occurred while fetching the user.',
        ),
      );
  }
}

/**
 * POST /users
 */
export async function createUser(
  request: RequestWithModels<{ Body: CreateUserBody }>,
  reply: FastifyReply,
) {
  const { User } = request.server.models;
  const { name, email } = request.body;

  try {
    if (await User.exists({ email })) {
      reply.code(409);
      return makeErrorResponse(
        409,
        'DUPLICATE_RESOURCE',
        'Conflict',
        'A user with this email address already exists.',
      );
    }

    const created = new User({ name, email });
    await created.save();
    // return saved document (toJSON/lean would be optional depending on model hooks)
    return reply.code(201).send(created);
  } catch (err: unknown) {
    request.server.log.error(err);

    return reply
      .code(500)
      .send(
        makeErrorResponse(
          500,
          'INTERNAL_SERVER_ERROR',
          'Internal Server Error',
          'An unexpected server error occurred while creating the user.',
        ),
      );
  }
}

/**
 * PUT /users/:userId
 */
export async function updateUserById(
  request: RequestWithModels<{ Params: ParamUserId; Body: EditUserBody }>,
  reply: FastifyReply,
) {
  const { User } = request.server.models;
  const { userId } = request.params;
  const update = request.body;

  try {
    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
      context: 'query',
    }).exec();

    if (!user) {
      return reply
        .code(404)
        .send(
          makeErrorResponse(
            404,
            'NOT_FOUND',
            'User Not Found',
            'The requested user resource could not be found.',
          ),
        );
    }

    return reply.code(200).send(user);
  } catch (err) {
    request.server.log.error(err);
    // Validation errors from Mongoose would be handleable here if desired
    return reply
      .code(500)
      .send(
        makeErrorResponse(
          500,
          'INTERNAL_SERVER_ERROR',
          'Internal Server Error',
          'An unexpected server error occurred while updating the user.',
        ),
      );
  }
}

/**
 * DELETE /users/:userId
 */
export async function deleteUserById(
  request: RequestWithModels<{ Params: ParamUserId }>,
  reply: FastifyReply,
) {
  const { User } = request.server.models;
  const { userId } = request.params;

  try {
    const user = await User.findByIdAndDelete(userId).lean().exec();

    if (!user) {
      return reply
        .code(404)
        .send(
          makeErrorResponse(
            404,
            'NOT_FOUND',
            'User Not Found',
            'The requested user resource could not be found.',
          ),
        );
    }

    return reply.code(200).send(user);
  } catch (err) {
    request.server.log.error(err);
    return reply
      .code(500)
      .send(
        makeErrorResponse(
          500,
          'INTERNAL_SERVER_ERROR',
          'Internal Server Error',
          'An unexpected server error occurred while deleting the user.',
        ),
      );
  }
}
