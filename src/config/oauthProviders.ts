export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/google/callback',
  TOKEN_INFO_URL: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
  USER_INFO_URL: 'https://www.googleapis.com/oauth2/v3/userinfo'
};
