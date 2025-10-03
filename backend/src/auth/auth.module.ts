import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersModule } from '@/users/users.module';
import { AuthService } from '@/auth/services/auth.service';
import { SessionsModule } from '@/sessions/sessions.module';
import { AuthController } from '@/auth/controllers/auth.controller';

@Module({
  imports: [UsersModule, SessionsModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
