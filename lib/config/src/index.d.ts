export declare const config: {
    logging: {
        applicationLoggingLevel: string;
    };
    PasswordComplexityActive: boolean;
    MinimumPasswordCharacters: number;
    postgres_b2b_database: {
        host: string;
        port: number;
        db: string;
        username: string;
        schemaName: string;
        debugMode: boolean;
        minConnections: number;
        maxConnections: number;
        sequelizeMinConnections: number;
        sequelizeMaxConnections: number;
        applicationName: string;
        applicationNameSequelize: string;
        acquire: number;
        idleTimeout: number;
        connectionTimeout: number;
    };
};
export default config;
