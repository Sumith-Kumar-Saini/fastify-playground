export const ErrorSchema = {
  type: 'object',
  properties: {
    code: { type: 'string' },
    message: { type: 'string' },
    error: { type: 'string' },
    statusCode: { type: 'number', default: 500 },
  },
} as const;
