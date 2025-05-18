import bcrypt from 'bcrypt';
import { PASSWORD_POLICY } from '../config/constants';

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SECURITY.BCRYPT_COST);
  }

  static validatePassword(password: string): boolean {
    return PASSWORD_POLICY.REGEX.test(password);
  }

  static generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
