import ENV from '../configs/env';

interface LoggerOptions {
  level: string;
  timestamp: boolean;
  transport?: {
    target: string;
    options: {
      translateTime: string;
      colorize: boolean;
      ignore: string;
    };
  };
}

export function getLoggerConfig(overrides?: { logger?: boolean | object }): false | LoggerOptions {
  const loggerOptions: LoggerOptions = {
    level: ENV.LOG_LEVEL || 'info',
    timestamp: true,
    transport:
      ENV.NODE_ENV === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              colorize: true,
              ignore: 'pid,hostname',
            },
          },
  };

  if (overrides?.logger === false) {
    return false;
  }

  return { ...loggerOptions, ...(typeof overrides?.logger === 'object' ? overrides.logger : {}) };
}
