export const PASSWORD_POLICY = {
  MIN_LENGTH: 12,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
  REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
};

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'auth-service',
  AUDIENCE: 'client-app'
};

export const SECURITY = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME_MINUTES: 30,
  BCRYPT_COST: 12
};
