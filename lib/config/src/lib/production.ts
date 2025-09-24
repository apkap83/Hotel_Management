export const productionConfig = {
  logDirPerEnvironment: 'prod',

  logging: {
    applicationLoggingLevel: 'info',
  },

  PasswordComplexityActive: false,
  MinimumPasswordCharacters: 4,

  postgres_b2b_database: {
    host: 'localhost',
    port: 5432,
    db: 'HotelManagement_DB',
    username: 'postgres',
    schemaName: 'hotel_production',
    debugMode: true,
    minConnections: 3,
    maxConnections: 3,
    sequelizeMinConnections: 3,
    sequelizeMaxConnections: 3,
    applicationName: 'Hotel Management Development',
    applicationNameSequelize: 'Hotel Management Development (Sequelize)',
    acquire: 45000,
    idleTimeout: 10000,
    connectionTimeout: 45000,
  },
};
