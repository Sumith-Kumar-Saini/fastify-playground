import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export const customErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  reply.status(error.statusCode || 500).send({
    statusCode: reply.statusCode,
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong',
  });
};
