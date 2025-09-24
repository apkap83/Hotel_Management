import * as winston from 'winston';

// Mock all external dependencies before any imports
jest.mock('winston-daily-rotate-file', () => {
  return class MockDailyRotateFile {
    public name: string;
    public level: string;
    public log: jest.MockedFunction<(...args: unknown[]) => void>;
    public write: jest.MockedFunction<(...args: unknown[]) => void>;
    public end: jest.MockedFunction<(...args: unknown[]) => void>;
    public on: jest.MockedFunction<(...args: unknown[]) => this>;
    public emit: jest.MockedFunction<(...args: unknown[]) => void>;
    public setMaxListeners: jest.MockedFunction<(n: number) => void>;
    public format: object;
    public silent: boolean;

    constructor() {
      this.name = 'daily-rotate-file';
      this.level = 'info';
      this.log = jest.fn();
      this.write = jest.fn();
      this.end = jest.fn();
      this.on = jest.fn().mockReturnThis();
      this.emit = jest.fn();
      this.setMaxListeners = jest.fn();
      this.format = {};
      this.silent = false;
    }
  };
});

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
}));

jest.mock('@hotel_manage/config', () => ({
  config: {
    logging: {
      applicationLoggingLevel: 'info',
    },
  },
}));

jest.mock('@hotel_manage/shared-models', () => ({
  TransportName: {
    AUTH: 'AUTH',
    ACTIONS: 'ACTIONS',
    EVENTS: 'EVENTS',
    ERROR: 'ERROR',
    COMBINED: 'COMBINED',
  },
}));

// Mock console.log to avoid noisy output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Logging Library Unit Tests', () => {
  // Import after mocks are set up
  let CustomLogger: typeof import('./logging').CustomLogger;
  let createRequestLogger: typeof import('./logging').createRequestLogger;
  let TransportName: typeof import('./logging').TransportName;

  beforeAll(() => {
    const loggingModule = require('./logging');
    CustomLogger = loggingModule.CustomLogger;
    createRequestLogger = loggingModule.createRequestLogger;
    TransportName = loggingModule.TransportName;
  });

  describe('CustomLogger Class', () => {
    let mockWinstonLogger: jest.Mocked<winston.Logger>;
    let customLogger: InstanceType<typeof CustomLogger>;

    beforeEach(() => {
      mockWinstonLogger = {
        log: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      } as unknown as jest.Mocked<winston.Logger>;

      customLogger = new CustomLogger(mockWinstonLogger, 'AUTH', {
        testMeta: 'test',
      });
    });

    it('should create CustomLogger instance', () => {
      expect(customLogger).toBeDefined();
      expect(typeof customLogger.log).toBe('function');
      expect(typeof customLogger.info).toBe('function');
      expect(typeof customLogger.warn).toBe('function');
      expect(typeof customLogger.error).toBe('function');
      expect(typeof customLogger.debug).toBe('function');
    });

    it('should call winston logger with correct parameters on log()', () => {
      customLogger.log('info', 'test message', { extra: 'data' });

      expect(mockWinstonLogger.log).toHaveBeenCalledWith({
        level: 'info',
        message: 'test message',
        testMeta: 'test',
        extra: 'data',
        transportName: 'AUTH',
      });
    });

    it('should call log with info level on info()', () => {
      const logSpy = jest.spyOn(customLogger, 'log');
      customLogger.info('info message', { meta: 'data' });

      expect(logSpy).toHaveBeenCalledWith('info', 'info message', {
        meta: 'data',
      });
    });

    it('should handle Error objects correctly in error()', () => {
      const logSpy = jest.spyOn(customLogger, 'log');
      const testError = new Error('Test error');
      testError.name = 'TestError';

      customLogger.error(testError, { additional: 'meta' });

      expect(logSpy).toHaveBeenCalledWith('error', 'Test error', {
        additional: 'meta',
        stack: testError.stack,
        errorName: 'TestError',
      });
    });

    it('should handle non-Error objects correctly in error()', () => {
      const logSpy = jest.spyOn(customLogger, 'log');

      customLogger.error('string error', { additional: 'meta' });

      expect(logSpy).toHaveBeenCalledWith('error', 'string error', {
        additional: 'meta',
        errorType: 'string',
      });
    });
  });

  describe('createRequestLogger Function', () => {
    it('should create CustomLogger with request metadata', () => {
      const requestLogger = createRequestLogger(
        'ACTIONS',
        '192.168.1.1',
        '/api/test',
        'session123'
      );

      expect(requestLogger).toBeDefined();
      expect(typeof requestLogger.info).toBe('function');
    });

    it('should include request metadata in logs', () => {
      const requestLogger = createRequestLogger(
        'ACTIONS',
        '192.168.1.1',
        '/api/test',
        'session123'
      );

      // Mock the internal logger to verify metadata
      const mockLog = jest.fn();
      requestLogger.logger = { log: mockLog };

      requestLogger.info('test message');

      expect(mockLog).toHaveBeenCalledWith({
        level: 'info',
        message: 'test message',
        reqIP: '192.168.1.1',
        reqURL: '/api/test',
        sessionId: 'session123',
        transportName: 'ACTIONS',
      });
    });
  });

  describe('TransportName', () => {
    it('should export TransportName enum', () => {
      expect(TransportName).toBeDefined();
      expect(TransportName.AUTH).toBe('AUTH');
      expect(TransportName.ACTIONS).toBe('ACTIONS');
      expect(TransportName.EVENTS).toBe('EVENTS');
      expect(TransportName.ERROR).toBe('ERROR');
      expect(TransportName.COMBINED).toBe('COMBINED');
    });
  });

  describe('Logger Integration', () => {
    it('should not throw when creating loggers', () => {
      expect(() => {
        const loggingModule = require('./logging');
        expect(loggingModule.logAuth).toBeDefined();
        expect(loggingModule.logAction).toBeDefined();
        expect(loggingModule.logEvent).toBeDefined();
        expect(loggingModule.logErr).toBeDefined();
        expect(loggingModule.logInfo).toBeDefined();
      }).not.toThrow();
    });
  });
});
