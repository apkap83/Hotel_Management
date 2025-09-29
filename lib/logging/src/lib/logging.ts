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

// Enhanced project root detection with better error handling
const findProjectRoot = (): string => {
  let currentDir = __dirname;
  const maxDepth = 10; // Prevent infinite loops
  let depth = 0;

  while (currentDir !== path.parse(currentDir).root && depth < maxDepth) {
    if (
      fs.existsSync(path.join(currentDir, 'nx.json')) ||
      fs.existsSync(path.join(currentDir, 'package.json'))
    ) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
    depth++;
  }

  console.warn('Project root not found, using process.cwd()');
  return process.cwd();
};

// Create the absolute path: <root>/logs/dev or <root>/logs/prod
const projectRoot = findProjectRoot();
const logPath = path.join(projectRoot, 'logs', logDir);

// Enhanced log directory creation with better error handling
const ensureLogDirectory = (path: string): void => {
  try {
    if (!fs.existsSync(path)) {
      console.log('Creating log directory at:', path);
      fs.mkdirSync(path, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create log directory:', error);
    throw error;
  }
};

ensureLogDirectory(logPath);

// Configuration object
const LOG_CONFIG = {
  maxFiles: config.logging.maxFiles,
  datePattern: 'YYYY-MM-DD',
  paths: {
    auth: path.join(logPath, 'auth-%DATE%.log'),
    actions: path.join(logPath, 'actions-%DATE%.log'),
    events: path.join(logPath, 'events-%DATE%.log'),
    error: path.join(logPath, 'error-%DATE%.log'),
    combined: path.join(logPath, 'combined-%DATE%.log'),
    exceptions: path.join(logPath, 'exceptions-%DATE%.log'),
    rejections: path.join(logPath, 'rejections-%DATE%.log'),
    sequelize: path.join(logPath, 'sequelize-db-actions-%DATE%.log'),
  },
};

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

// Enhanced format for better readability in development
const developmentFormat = combine(
  colorize({ all: true }),
  errors({ stack: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf((info) => {
    const { timestamp, level, message, transportName, ...meta } = info;
    const metaStr =
      Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level} [${
      transportName || 'UNKNOWN'
    }]: ${message}${metaStr}`;
  })
);

// Production format optimized for log aggregation
const productionFormat = combine(timestamp(), errors({ stack: true }), json());

const createTransports = () => {
  const transports: winston.transport[] = [];

  if (process.env['NODE_ENV'] !== 'test') {
    // File transports
    transports.push(
      new DailyRotateFile({
        level: 'info',
        filename: LOG_CONFIG.paths.auth,
        datePattern: LOG_CONFIG.datePattern,
        maxFiles: LOG_CONFIG.maxFiles,
        format: combine(createFilter(TransportName.AUTH), productionFormat),
        auditFile: path.join(logPath, 'audit-auth.json'),
      }),
      new DailyRotateFile({
        level: 'info',
        filename: LOG_CONFIG.paths.actions,
        datePattern: LOG_CONFIG.datePattern,
        maxFiles: LOG_CONFIG.maxFiles,
        format: combine(createFilter(TransportName.ACTIONS), productionFormat),
        auditFile: path.join(logPath, 'audit-actions.json'),
      }),
      new DailyRotateFile({
        level: 'info',
        filename: LOG_CONFIG.paths.events,
        datePattern: LOG_CONFIG.datePattern,
        maxFiles: LOG_CONFIG.maxFiles,
        format: combine(createFilter(TransportName.EVENTS), productionFormat),
        auditFile: path.join(logPath, 'audit-events.json'),
      }),
      new DailyRotateFile({
        level: 'error',
        filename: LOG_CONFIG.paths.error,
        datePattern: LOG_CONFIG.datePattern,
        maxFiles: LOG_CONFIG.maxFiles,
        format: productionFormat,
        auditFile: path.join(logPath, 'audit-error.json'),
      }),
      new DailyRotateFile({
        level: 'info',
        filename: LOG_CONFIG.paths.combined,
        datePattern: LOG_CONFIG.datePattern,
        maxFiles: LOG_CONFIG.maxFiles,
        format: productionFormat,
        auditFile: path.join(logPath, 'audit-combined.json'),
      })
    );
  }

  // Console transport for non-production environments
  if (env !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: developmentFormat,
      })
    );
  }

  return transports;
};

const logger = winston.createLogger({
  level: config.logging.applicationLoggingLevel,
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: createTransports(),
  exceptionHandlers: [
    new DailyRotateFile({
      level: 'info',
      filename: LOG_CONFIG.paths.exceptions,
      datePattern: LOG_CONFIG.datePattern,
      maxFiles: LOG_CONFIG.maxFiles,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      level: 'info',
      filename: LOG_CONFIG.paths.rejections,
      datePattern: LOG_CONFIG.datePattern,
      maxFiles: LOG_CONFIG.maxFiles,
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
      filename: LOG_CONFIG.paths.sequelize,
      datePattern: LOG_CONFIG.datePattern,
      maxFiles: LOG_CONFIG.maxFiles,
      format: winston.format.combine(winston.format.timestamp(), customFormat),
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
