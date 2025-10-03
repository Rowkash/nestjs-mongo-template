import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(request: ICustomRequest, _: Response, next: NextFunction) {
    const { headers } = request;
    const { authorization } = headers;
    if (!authorization) {
      request.user = null;
      return next();
    }

    const [, token] = authorization.split(' ');

    try {
      const secret = this.configService.get<string>('auth.jwtSecret');
      const payload: IRequestUser = await this.jwtService.verifyAsync(token, {
        secret,
      });

      request.user = payload;
      return next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Invalid access token');
    }
  }
}
