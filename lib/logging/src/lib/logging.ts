import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '@hotel_manage/config';
import { TransportName } from '@hotel_manage/shared-models';

const { combine, timestamp, json, printf, colorize, align, errors } =
  winston.format;

const env =
  process.env['NODE_ENV'] === 'production' ? 'production' : 'development';

// Use logs/dev for development and logs/prod for production
const logDir = env === 'production' ? 'prod' : 'dev';

// Find the project root by looking for package.json or nx.json
const findProjectRoot = (): string => {
  let currentDir = __dirname;
  
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'nx.json')) || 
        fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  // Fallback to process.cwd() if not found
  return process.cwd();
};

// Create the absolute path: <root>/logs/dev or <root>/logs/prod
const projectRoot = findProjectRoot();
const logPath = path.join(projectRoot, 'logs', logDir);

// Ensure log directory exists
if (!fs.existsSync(logPath)) {
  console.log('Creating log directory at:', logPath);
  fs.mkdirSync(logPath, { recursive: true });
}

const authLogFilePath = path.join(logPath, 'auth-%DATE%.log');
const actionsLogFilePath = path.join(logPath, 'actions-%DATE%.log');
const eventsLogFilePath = path.join(logPath, 'events-%DATE%.log');
const errorLogFilePath = path.join(logPath, 'error-%DATE%.log');
const combinedLogFilePath = path.join(logPath, 'combined-%DATE%.log');

// Create custom format to filter logs based on transportName
const createFilter = (transportName: TransportName) => {
  return winston.format((info) => {
    return info['transportName'] === transportName ? info : false;
  })();
};

const MyTransports = [];

if (process.env['NODE_ENV'] !== 'test') {
  MyTransports.push(
    new DailyRotateFile({
      level: 'info',
      filename: authLogFilePath,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(createFilter(TransportName.AUTH), json()),
    }),
    new DailyRotateFile({
      level: 'info',
      filename: actionsLogFilePath,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(createFilter(TransportName.ACTIONS), json()),
    }),
    new DailyRotateFile({
      level: 'info',
      filename: eventsLogFilePath,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(createFilter(TransportName.EVENTS), json()),
    }),
    new DailyRotateFile({
      level: 'error',
      filename: errorLogFilePath,
      format: combine(json()),
    }),
    new DailyRotateFile({
      level: 'info',
      filename: combinedLogFilePath,
      format: combine(json()),
    })
  );
}

// if (process.env['NODE_ENV'] !== 'production') {
//   MyTransports.push(
//     new winston.transports.Console({
//       format: combine(json()),
//     })
//   );
// }

const logger = winston.createLogger({
  // level: process.env.LOG_LEVEL || 'info',
  level: config.logging.applicationLoggingLevel,
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: MyTransports,
  exceptionHandlers: [
    new DailyRotateFile({
      level: 'info',
      filename: path.join(logPath, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      level: 'info',
      filename: path.join(logPath, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// Define a custom console format that includes the timestamp
const simpleLogFormat = combine(
  colorize({ all: true }),
  errors({ stack: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf((info) => `[${info['timestamp']}] ${info.level}: ${info.message}`)
);

// Console Logging
if (process.env['NODE_ENV'] !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: simpleLogFormat,
    })
  );
}

export class CustomLogger {
  private logger: winston.Logger;
  private transportName: TransportName;
  private defaultMeta: object;

  constructor(
    logger: winston.Logger,
    transportName: TransportName,
    defaultMeta: object = {}
  ) {
    this.logger = logger;
    this.transportName = transportName;
    this.defaultMeta = defaultMeta;
  }

  log(level: string, message: string, meta: object = {}) {
    this.logger.log({
      level,
      message,
      ...this.defaultMeta,
      ...meta,
      transportName: this.transportName,
    });
  }

  info(message: string, meta: object = {}) {
    this.log('info', message, meta);
  }

  warn(message: string, meta: object = {}) {
    this.log('warn', message, meta);
  }

  error(error: unknown, meta: object = {}) {
    if (error instanceof Error) {
      this.log('error', error.message, {
        ...meta,
        stack: error.stack,
        errorName: error.name,
      });
    } else {
      this.log('error', String(error), { ...meta, errorType: typeof error });
    }
  }

  debug(message: string, meta: object = {}) {
    this.log('debug', message, meta);
  }
}

// Function to create a logger instance with reqIP, reqURL, and sessionId
export const createRequestLogger = (
  transportName: TransportName,
  reqIP: string | null,
  reqURL: string | null,
  sessionId: string | null
) => {
  const defaultMeta = { reqIP, reqURL, sessionId };
  return new CustomLogger(logger, transportName, defaultMeta);
};

const logAuth = new CustomLogger(logger, TransportName.AUTH);
const logAction = new CustomLogger(logger, TransportName.ACTIONS);
const logEvent = new CustomLogger(logger, TransportName.EVENTS);
const logErr = new CustomLogger(logger, TransportName.ERROR);
const logInfo = new CustomLogger(logger, TransportName.COMBINED);

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const sequelizeDBActionsLogger = winston.createLogger({
  level: 'info',
  transports: [
    new DailyRotateFile({
      filename: path.join(logPath, 'sequelize-db-actions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
      ),
    }),
  ],
});

export {
  logAuth,
  logAction,
  logEvent,
  logErr,
  logInfo,
  TransportName,
  sequelizeDBActionsLogger,
};
