export const productionConfig = {
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
    applicationName: 'Hotel Management Production',
    applicationNameSequelize: 'Hotel Management Production (Sequelize)',
    acquire: 45000,
    idleTimeout: 10000,
    connectionTimeout: 45000,
  },
  api: {
    process: 'hotel_management',
    user: 'ProductionApiUser',
  },
  logging: {
    applicationLoggingLevel: 'info',
    maxFiles: '14d',
  },
  TICKET_ITEMS_PER_PAGE: 20,
  CaptchaIsActive: false,
  CaptchaIsActiveForPasswordReset: true,
  CaptchaV3Threshold: 0.1,
  TwoFactorEnabled: true,
  TwoFactorEnabledForPasswordReset: true,
  TwoFactorDigitsLength: 5,
  TwoFactorValiditySeconds: 270,
  maxOTPAttemps: 5,
  maxOTPAttemptsBanTimeInSec: 300,
  ShowCookieConsentBanner: true,
  cookieConsentValidityInDays: 365,
  SessionMaxAge: 60 * 60, // Session max age to 60 minutes (in seconds)
  SessionUpdateAge: 60, // Session is refreshed every 60 seconds

  SessionExpirationPopupShownInSeconds: 60 * 5, // 5 min
};
