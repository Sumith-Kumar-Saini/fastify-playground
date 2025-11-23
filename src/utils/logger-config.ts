import ENV from '../configs/env';

const isDev = ENV.NODE_ENV !== 'production';
const logger = {
  level: ENV.LOG_LEVEL,
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
