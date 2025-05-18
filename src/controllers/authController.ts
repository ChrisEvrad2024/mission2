import { GoogleAuthUtils } from '../utils/googleAuthUtils';

export class AuthController {
  // ... autres méthodes existantes ...

  static async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken, accessToken } = req.body;

      if (!idToken) {
        throw new ErrorHandler(400, 'Google ID token is required');
      }

      // Vérification du token
      const { email } = await GoogleAuthUtils.verifyToken(idToken);
      
      // Récupération des infos utilisateur supplémentaires
      const userInfo = await GoogleAuthUtils.getUserInfo(accessToken);

      // Recherche ou création de l'utilisateur
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          password_hash: null, // Pas de mot de passe pour les utilisateurs Google
          role_id: (await Role.findOne({ where: { name: 'etudiant' }))?.id,
          is_active: true,
          last_login: new Date()
        },
        include: [Role]
      });

      if (!created) {
        await user.update({ last_login: new Date() });
      }

      // Génération des tokens JWT
      const tokens = AuthUtils.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role.name
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role.name,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            picture: userInfo.picture
          },
          tokens
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
