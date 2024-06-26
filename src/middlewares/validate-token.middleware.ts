import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HelperService } from '../helpers/helper.service';

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  constructor(private readonly helperService: HelperService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }
      await this.helperService.validateAdminToken(token);
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
