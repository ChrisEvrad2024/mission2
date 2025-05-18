import axios from 'axios';
import { GOOGLE_CONFIG } from '../config/oauthProviders';
import { ErrorHandler } from '../middlewares/errorHandler';

export class GoogleAuthUtils {
  static async verifyToken(idToken: string) {
    try {
      const response = await axios.get(`${GOOGLE_CONFIG.TOKEN_INFO_URL}?id_token=${idToken}`);
      const { aud, email_verified, email } = response.data;

      if (aud !== GOOGLE_CONFIG.CLIENT_ID) {
        throw new ErrorHandler(401, 'Invalid Google token audience');
      }

      if (!email_verified) {
        throw new ErrorHandler(403, 'Google email not verified');
      }

      return { email };
    } catch (error) {
      throw new ErrorHandler(401, 'Invalid Google token', { originalError: error.message });
    }
  }

  static async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(GOOGLE_CONFIG.USER_INFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      throw new ErrorHandler(401, 'Failed to fetch Google user info', { originalError: error.message });
    }
  }
}
