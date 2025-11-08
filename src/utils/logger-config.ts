const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined, // In production, keep structured JSON
};

export default logger;
