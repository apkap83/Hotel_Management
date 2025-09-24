import { Sequelize } from 'sequelize';

import { config } from '@hotel_manage/config';
import { sequelizeDBActionsLogger } from '@hotel_manage/logging';

import { AppUser } from './models/User';
import { AppRole } from './models/Role';
import { AppPermission } from './models/Permission';
import { Customer } from './models/Customer';

// Define a custom logging function for Sequelize
const sequelizeLogger = (msg: string) => {
  sequelizeDBActionsLogger.info(msg);
};

const sequelize = new Sequelize({
  host: config.postgres_b2b_database.host,
  port: config.postgres_b2b_database.port,
  username: config.postgres_b2b_database.username,
  password: process.env['POSTGRES_B2B_PASSWORD'],
  database: config.postgres_b2b_database.db,
  dialect: 'postgres',

  // REMEMBER This is required in NextJS environment
  dialectModule: require('pg'),
  dialectOptions: {
    charset: 'utf8',
    application_name: config.postgres_b2b_database.applicationNameSequelize,
    keepAlive: true,
    connectTimeout: config.postgres_b2b_database.connectionTimeout,
  },

  define: {
    freezeTableName: true,
    timestamps: true,
    schema: config.postgres_b2b_database.schemaName,
  },

  // logging: sequelizeLogging,
  // pool: {
  //   max: config.postgres_b2b_database.sequelizeMaxConnections,
  //   min: config.postgres_b2b_database.sequelizeMinConnections,
  //   acquire: config.postgres_b2b_database.acquire,
  //   idle: config.postgres_b2b_database.idleTimeout,
  // },
  logging: sequelizeLogger,
});

Customer.initModel(sequelize);
AppUser.initModel(sequelize);
AppRole.initModel(sequelize);
AppPermission.initModel(sequelize);

const applyAssociations = () => {
  try {
    // Association between Customer and User
    Customer.hasMany(AppUser, {
      foreignKey: 'customer_id',
      as: 'users',
    });
    
    AppUser.belongsTo(Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });

    // Association between B2BUser and AppRole through _userRoleB2B table
    AppUser.belongsToMany(AppRole, {
      through: '_userRole',
      foreignKey: 'user_id', // The column in _userRoleB2B table that references B2BUser
      otherKey: 'role_id', // The column in _userRoleB2B table that references AppRole
      timestamps: false,
    });

    AppRole.belongsToMany(AppUser, {
      through: '_userRole',
      foreignKey: 'role_id', // The column in _userRoleB2B table that references AppRole
      otherKey: 'user_id', // The column in _userRoleB2B table that references B2BUser
      timestamps: false,
    });

    // Association between AppRole and AppPermission through _rolePermission table
    AppRole.belongsToMany(AppPermission, {
      through: '_rolePermission',
      foreignKey: 'role_id', // The column in _rolePermission table that references AppRole
      otherKey: 'permission_id', // The column in _rolePermission table that references AppPermission
      timestamps: false,
    });

    AppPermission.belongsToMany(AppRole, {
      through: '_rolePermission',
      foreignKey: 'permission_id', // The column in _rolePermission table that references AppPermission
      otherKey: 'role_id', // The column in _rolePermission table that references AppRole
      timestamps: false,
    });
  } catch (error) {
    console.error('Error applying associations:', error);
  }
};

applyAssociations();

// Database sync function for development
export const syncDatabase = async (options: { force?: boolean; alter?: boolean } = {}) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync(options);
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export { sequelize, AppRole, AppPermission, AppUser, Customer };
