export const ErrorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    status: { type: 'number', default: 500 },
    timestamp: { type: 'string', format: 'data-time' },
  },
} as const;
