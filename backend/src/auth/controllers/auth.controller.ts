import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

import { AuthService } from '@/auth/services/auth.service';
import { AuthLoginDto } from '@/auth/dto/auth-login.dto';
import { clearCookie, setCookie } from '@/common/useCookie';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';
import { ICustomRequest } from '@/common/interfaces/custom-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user',
    description:
      'Register user and return accessToken, refreshToken, inject refreshToken to cookie',
  })
  @Post('register')
  async register(
    @Body() dto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    setCookie(refreshToken, res);
    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(
    @Req() req: ICustomRequest,
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    const { accessToken, refreshToken } = await this.authService.login({
      sessionId,
      ...dto,
    });

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }

  @Post('logout user')
  @ApiOperation({
    summary: 'Logout',
    description: 'Delete cookie and session',
  })
  async logout(
    @Req() req: ICustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    await this.authService.logout(sessionId as string);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      domain: 'localhost',
      secure: true,
      sameSite: 'lax',
    });
    clearCookie(res);
  }

  @Post('refresh-tokens')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Refresh tokens by cookie refresh token. Return both of them and update session',
  })
  async refreshTokens(
    @Req() req: ICustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      sessionId as string,
    );

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }
}
