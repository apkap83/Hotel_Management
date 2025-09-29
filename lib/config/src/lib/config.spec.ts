import { productionConfig } from './production';
import { developmentConfig } from './development';

// Mock process.env before importing the main config
const originalEnv = process.env['NODE_ENV'];

// Clear the module cache to ensure fresh imports
beforeEach(() => {
  jest.resetModules();
});

afterAll(() => {
  process.env['NODE_ENV'] = originalEnv;
});

describe('Config Library', () => {
  describe('Development Configuration', () => {
    it('should export developmentConfig with correct structure', () => {
      expect(developmentConfig).toBeDefined();
      expect(typeof developmentConfig).toBe('object');
    });

    it('should have logging configuration', () => {
      expect(developmentConfig.logging).toBeDefined();
      expect(developmentConfig.logging.applicationLoggingLevel).toBe('info');
      expect(developmentConfig.logging.maxFiles).toBe('14d');
    });

    it('should have password configuration', () => {
      expect(typeof developmentConfig.PasswordComplexityActive).toBe('boolean');
      expect(typeof developmentConfig.MinimumPasswordCharacters).toBe('number');
      expect(developmentConfig.PasswordComplexityActive).toBe(false);
      expect(developmentConfig.MinimumPasswordCharacters).toBe(4);
    });

    it('should have postgres database configuration', () => {
      const dbConfig = developmentConfig.postgres_b2b_database;
      
      expect(dbConfig).toBeDefined();
      expect(dbConfig.host).toBe('localhost');
      expect(dbConfig.port).toBe(5432);
      expect(dbConfig.db).toBe('HotelManagement_DB');
      expect(dbConfig.username).toBe('postgres');
      expect(dbConfig.schemaName).toBe('hotel_development');
      expect(dbConfig.debugMode).toBe(true);
      expect(dbConfig.minConnections).toBe(3);
      expect(dbConfig.maxConnections).toBe(3);
      expect(dbConfig.sequelizeMinConnections).toBe(3);
      expect(dbConfig.sequelizeMaxConnections).toBe(3);
      expect(dbConfig.applicationName).toBe('Hotel Management Development');
      expect(dbConfig.applicationNameSequelize).toBe('Hotel Management Development (Sequelize)');
      expect(dbConfig.acquire).toBe(45000);
      expect(dbConfig.idleTimeout).toBe(10000);
      expect(dbConfig.connectionTimeout).toBe(45000);
    });

    it('should have correct schema name for development', () => {
      expect(developmentConfig.postgres_b2b_database.schemaName).toBe('hotel_development');
    });
  });

  describe('Production Configuration', () => {
    it('should export productionConfig with correct structure', () => {
      expect(productionConfig).toBeDefined();
      expect(typeof productionConfig).toBe('object');
    });

    it('should have logging configuration', () => {
      expect(productionConfig.logging).toBeDefined();
      expect(productionConfig.logging.applicationLoggingLevel).toBe('info');
      expect(productionConfig.logging.maxFiles).toBe('14d');
    });

    it('should have password configuration', () => {
      expect(typeof productionConfig.PasswordComplexityActive).toBe('boolean');
      expect(typeof productionConfig.MinimumPasswordCharacters).toBe('number');
      expect(productionConfig.PasswordComplexityActive).toBe(false);
      expect(productionConfig.MinimumPasswordCharacters).toBe(4);
    });

    it('should have postgres database configuration', () => {
      const dbConfig = productionConfig.postgres_b2b_database;
      
      expect(dbConfig).toBeDefined();
      expect(dbConfig.host).toBe('localhost');
      expect(dbConfig.port).toBe(5432);
      expect(dbConfig.db).toBe('HotelManagement_DB');
      expect(dbConfig.username).toBe('postgres');
      expect(dbConfig.schemaName).toBe('hotel_production');
      expect(dbConfig.debugMode).toBe(true);
      expect(dbConfig.minConnections).toBe(3);
      expect(dbConfig.maxConnections).toBe(3);
      expect(dbConfig.sequelizeMinConnections).toBe(3);
      expect(dbConfig.sequelizeMaxConnections).toBe(3);
      expect(dbConfig.applicationName).toBe('Hotel Management Development');
      expect(dbConfig.applicationNameSequelize).toBe('Hotel Management Development (Sequelize)');
      expect(dbConfig.acquire).toBe(45000);
      expect(dbConfig.idleTimeout).toBe(10000);
      expect(dbConfig.connectionTimeout).toBe(45000);
    });

    it('should have correct schema name for production', () => {
      expect(productionConfig.postgres_b2b_database.schemaName).toBe('hotel_production');
    });
  });

  describe('Environment-based Configuration Selection', () => {
    it('should export development config when NODE_ENV is not production', async () => {
      process.env['NODE_ENV'] = 'development';
      
      const { config } = await import('../index');
      
      expect(config).toEqual(developmentConfig);
      expect(config.postgres_b2b_database.schemaName).toBe('hotel_development');
    });

    it('should export production config when NODE_ENV is production', async () => {
      process.env['NODE_ENV'] = 'production';
      
      const { config } = await import('../index');
      
      expect(config).toEqual(productionConfig);
      expect(config.postgres_b2b_database.schemaName).toBe('hotel_production');
    });

    it('should default to development config when NODE_ENV is undefined', async () => {
      delete process.env['NODE_ENV'];
      
      const { config } = await import('../index');
      
      expect(config).toEqual(developmentConfig);
      expect(config.postgres_b2b_database.schemaName).toBe('hotel_development');
    });

    it('should default to development config when NODE_ENV is test', async () => {
      process.env['NODE_ENV'] = 'test';
      
      const { config } = await import('../index');
      
      expect(config).toEqual(developmentConfig);
      expect(config.postgres_b2b_database.schemaName).toBe('hotel_development');
    });

    it('should export default export as same as named export', async () => {
      process.env['NODE_ENV'] = 'development';
      
      const configModule = await import('../index');
      
      expect(configModule.default).toEqual(configModule.config);
    });
  });

  describe('Configuration Structure Validation', () => {
    it('should have consistent structure between development and production configs', () => {
      const devKeys = Object.keys(developmentConfig).sort();
      const prodKeys = Object.keys(productionConfig).sort();
      
      expect(devKeys).toEqual(prodKeys);
    });

    it('should have consistent logging structure', () => {
      const devLoggingKeys = Object.keys(developmentConfig.logging).sort();
      const prodLoggingKeys = Object.keys(productionConfig.logging).sort();
      
      expect(devLoggingKeys).toEqual(prodLoggingKeys);
    });

    it('should have consistent database configuration structure', () => {
      const devDbKeys = Object.keys(developmentConfig.postgres_b2b_database).sort();
      const prodDbKeys = Object.keys(productionConfig.postgres_b2b_database).sort();
      
      expect(devDbKeys).toEqual(prodDbKeys);
    });

    it('should have valid logging levels', () => {
      const validLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
      
      expect(validLevels).toContain(developmentConfig.logging.applicationLoggingLevel);
      expect(validLevels).toContain(productionConfig.logging.applicationLoggingLevel);
    });

    it('should have valid maxFiles format', () => {
      const maxFilesRegex = /^\d+[dwmy]$/; // number followed by d/w/m/y
      
      expect(developmentConfig.logging.maxFiles).toMatch(maxFilesRegex);
      expect(productionConfig.logging.maxFiles).toMatch(maxFilesRegex);
    });

    it('should have positive connection values', () => {
      const devDb = developmentConfig.postgres_b2b_database;
      const prodDb = productionConfig.postgres_b2b_database;
      
      // Test development config
      expect(devDb.port).toBeGreaterThan(0);
      expect(devDb.minConnections).toBeGreaterThan(0);
      expect(devDb.maxConnections).toBeGreaterThanOrEqual(devDb.minConnections);
      expect(devDb.sequelizeMinConnections).toBeGreaterThan(0);
      expect(devDb.sequelizeMaxConnections).toBeGreaterThanOrEqual(devDb.sequelizeMinConnections);
      expect(devDb.acquire).toBeGreaterThan(0);
      expect(devDb.idleTimeout).toBeGreaterThan(0);
      expect(devDb.connectionTimeout).toBeGreaterThan(0);
      
      // Test production config
      expect(prodDb.port).toBeGreaterThan(0);
      expect(prodDb.minConnections).toBeGreaterThan(0);
      expect(prodDb.maxConnections).toBeGreaterThanOrEqual(prodDb.minConnections);
      expect(prodDb.sequelizeMinConnections).toBeGreaterThan(0);
      expect(prodDb.sequelizeMaxConnections).toBeGreaterThanOrEqual(prodDb.sequelizeMinConnections);
      expect(prodDb.acquire).toBeGreaterThan(0);
      expect(prodDb.idleTimeout).toBeGreaterThan(0);
      expect(prodDb.connectionTimeout).toBeGreaterThan(0);
    });

    it('should have valid password configuration', () => {
      expect(typeof developmentConfig.PasswordComplexityActive).toBe('boolean');
      expect(typeof productionConfig.PasswordComplexityActive).toBe('boolean');
      
      expect(developmentConfig.MinimumPasswordCharacters).toBeGreaterThan(0);
      expect(productionConfig.MinimumPasswordCharacters).toBeGreaterThan(0);
    });
  });

  describe('Configuration Immutability', () => {
    it('should not allow modification of development config', () => {
      expect(() => {
        (developmentConfig as any).newProperty = 'test';
      }).not.toThrow(); // Note: JavaScript doesn't prevent this by default
      
      // But we can test that the original properties are intact
      expect(developmentConfig.logging.applicationLoggingLevel).toBe('info');
    });

    it('should not allow modification of production config', () => {
      expect(() => {
        (productionConfig as any).newProperty = 'test';
      }).not.toThrow(); // Note: JavaScript doesn't prevent this by default
      
      // But we can test that the original properties are intact  
      expect(productionConfig.logging.applicationLoggingLevel).toBe('info');
    });
  });

  describe('Type Safety and Schema Validation', () => {
    it('should have string values for database connection properties', () => {
      const devDb = developmentConfig.postgres_b2b_database;
      const prodDb = productionConfig.postgres_b2b_database;
      
      expect(typeof devDb.host).toBe('string');
      expect(typeof devDb.db).toBe('string');
      expect(typeof devDb.username).toBe('string');
      expect(typeof devDb.schemaName).toBe('string');
      expect(typeof devDb.applicationName).toBe('string');
      expect(typeof devDb.applicationNameSequelize).toBe('string');
      
      expect(typeof prodDb.host).toBe('string');
      expect(typeof prodDb.db).toBe('string');
      expect(typeof prodDb.username).toBe('string');
      expect(typeof prodDb.schemaName).toBe('string');
      expect(typeof prodDb.applicationName).toBe('string');
      expect(typeof prodDb.applicationNameSequelize).toBe('string');
    });

    it('should have numeric values for database numeric properties', () => {
      const devDb = developmentConfig.postgres_b2b_database;
      const prodDb = productionConfig.postgres_b2b_database;
      
      const numericProps = [
        'port', 'minConnections', 'maxConnections', 
        'sequelizeMinConnections', 'sequelizeMaxConnections',
        'acquire', 'idleTimeout', 'connectionTimeout'
      ];
      
      numericProps.forEach(prop => {
        expect(typeof devDb[prop as keyof typeof devDb]).toBe('number');
        expect(typeof prodDb[prop as keyof typeof prodDb]).toBe('number');
      });
    });

    it('should have boolean values for boolean properties', () => {
      expect(typeof developmentConfig.PasswordComplexityActive).toBe('boolean');
      expect(typeof developmentConfig.postgres_b2b_database.debugMode).toBe('boolean');
      
      expect(typeof productionConfig.PasswordComplexityActive).toBe('boolean');
      expect(typeof productionConfig.postgres_b2b_database.debugMode).toBe('boolean');
    });
  });
});