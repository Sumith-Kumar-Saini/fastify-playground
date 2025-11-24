export const healthCheckResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    message: { type: 'string' },
    services: {
      type: 'object',
      properties: {
        succeededServices: { type: 'array', items: { type: 'string' }, nullable: true },
        failedServices: { type: 'array', items: { type: 'string' }, nullable: true },
      },
      required: ['succeededServices', 'failedServices'],
    },
  },
  required: ['status', 'message'],
};
