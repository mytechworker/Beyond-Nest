// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const [, token] = authHeader.split(' ');
      if (!token) {
        return res.status(400).send({
          message: 'Token not found',
          success: false,
          data: null,
        });
      }
      try {
        const user = this.jwtService.verify(token);
        req.user = user;
        next();
      } catch (err) {
        return res.status(403).send({
          message: 'Invalid token',
          success: false,
          data: null,
        });
      }
    } else {
      return res.status(400).send({
        message: 'Authorization header not found',
        success: false,
        data: null,
      });
    }
  }
}
