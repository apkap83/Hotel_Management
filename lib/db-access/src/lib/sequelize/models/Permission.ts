import { Sequelize, Model, DataTypes } from 'sequelize';
export type { AppPermissionAttributes };

// Make 'id' optional for creation
interface AppPermissionAttributes {
  id?: number; // Optional during creation
  permissionName: string;
  endPoint?: string;
  description?: string;
}

// Define the creation attributes where 'id' is optional
interface AppPermissionCreationAttributes
  extends Omit<AppPermissionAttributes, 'id'> {}

export class AppPermission extends Model<
  AppPermissionAttributes,
  AppPermissionCreationAttributes
> {
  public id!: number;
  public permissionName!: string;
  public endPoint?: string;
  public description?: string;

  public static initModel(sequelize: Sequelize): typeof AppPermission {
    return AppPermission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        permissionName: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        endPoint: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'AppPermission',
        tableName: 'AppPermission',
        indexes: [
          {
            unique: true,
            fields: ['permissionName'],
            name: 'idx_permissionName',
          },
        ],
      }
    );
  }
}
