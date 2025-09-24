import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

// Define the attributes interface
export interface CustomerAttributes {
  customer_id: number;
  customer_name: string;
  customer_code: string;
  customer_type_id: number;
  fiscal_number?: string;
  record_version: number;
  creation_date: Date;
  creation_user: string;
  last_update_date?: Date;
  last_update_user?: string;
  last_update_process: string;
}

// Define the creation attributes interface
export interface CustomerCreationAttributes
  extends Optional<CustomerAttributes, 'customer_id' | 'fiscal_number' | 'last_update_date' | 'last_update_user'> {}

export class Customer
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  public customer_id!: number;
  public customer_name!: string;
  public customer_code!: string;
  public customer_type_id!: number;
  public fiscal_number?: string;
  public record_version!: number;
  public creation_date!: Date;
  public creation_user!: string;
  public last_update_date?: Date;
  public last_update_user?: string;
  public last_update_process!: string;

  public static initModel(sequelize: Sequelize): typeof Customer {
    return Customer.init(
      {
        customer_id: {
          type: DataTypes.DECIMAL,
          primaryKey: true,
          allowNull: false,
        },
        customer_name: {
          type: DataTypes.STRING(250),
          allowNull: false,
        },
        customer_code: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        customer_type_id: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          // TODO: Add reference to customer_types when that table is created
          // references: {
          //   model: 'customer_types',
          //   key: 'customer_type_id',
          // },
        },
        fiscal_number: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        record_version: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        creation_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        creation_user: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        last_update_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        last_update_user: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        last_update_process: {
          type: DataTypes.STRING(250),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Customer',
        tableName: 'customers',
        timestamps: false,
        indexes: [
          {
            name: 'customers_pkey',
            unique: true,
            fields: [{ name: 'customer_id' }],
          },
          {
            name: 'cust_custt_fki',
            fields: [{ name: 'customer_type_id' }],
          },
          {
            name: 'customers_uk1',
            unique: true,
            fields: [
              {
                name: 'customer_name',
                // For case-insensitive uniqueness - handled at DB level with UPPER()
              },
            ],
          },
          {
            name: 'customers_uk2',
            unique: true,
            fields: [
              {
                name: 'customer_code',
                // For case-insensitive uniqueness - handled at DB level with UPPER()
              },
            ],
          },
          {
            name: 'customers_uk3',
            unique: true,
            fields: [
              {
                name: 'fiscal_number',
                // For case-insensitive uniqueness - handled at DB level with UPPER()
              },
            ],
          },
        ],
      }
    );
  }
}