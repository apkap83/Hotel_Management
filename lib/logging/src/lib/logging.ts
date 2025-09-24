import fs from 'fs';
import path from 'path';
import winston, { createLogger, transports } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { config } from '@hotel_manage/config';
import { TransportName } from '@hotel_manage/shared-models';

const { combine, timestamp, json, printf, colorize, align, errors } =
  winston.format;

const env =
  process.env['NODE_ENV'] === 'production' ? 'production' : 'development';

const logDir = config.logDirPerEnvironment;

const logPath = path.join(process.cwd(), 'logs', logDir);

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

if (process.env['NODE_ENV'] !== 'production') {
  MyTransports.push(
    new winston.transports.Console({
      format: combine(json()),
    })
  );
}

// const logger = winston.createLogger({
//   // level: process.env.LOG_LEVEL || 'info',
//   level: config.logging.applicationLoggingLevel,
//   format: combine(errors({ stack: true }), timestamp(), json()),
//   transports: transports,
//   exceptionHandlers: [
//     new winston.transports.DailyRotateFile({
//       level: 'info',
//       filename: path.join(logPath, 'exceptions-%DATE%.log'),
//       datePattern: 'YYYY-MM-DD',
//       maxFiles: '14d',
//     }),
//   ],
//   rejectionHandlers: [
//     new winston.transports.DailyRotateFile({
//       level: 'info',
//       filename: path.join(logPath, 'rejections-%DATE%.log'),
//       datePattern: 'YYYY-MM-DD',
//       maxFiles: '14d',
//     }),
//   ],
// });
