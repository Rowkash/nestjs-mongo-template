import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import appConfig from '@/configs/app.config';
import authConfig from '@/configs/auth.config';
import { AuthModule } from '@/auth/auth.module';
import mongoConfig from '@/configs/mongo.config';
import minioConfig from '@/configs/minio.config';
import redisConfig from '@/configs/redis.config';
import { MediaModule } from '@/media/media.module';
import { UsersModule } from '@/users/users.module';
import { MinioModule } from '@/minio/minio.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggingModule } from '@/logging/logging.module';
import { BullQueueModule } from '@/bull/bull-queue.module';
import pinoLoggerConfig from '@/configs/pino-logger.config';
import { SessionsModule } from '@/sessions/sessions.module';
import { DatabasesModule } from '@/database/databases.module';
import { CustomThrottlerGuard } from '@/common/throtler.guard';
import { PortfoliosModule } from '@/portfolios/portfolios.module';
import { PrometheusModule } from '@/prometheus/prometheus.module';
import { CacheConfigService } from '@/configs/cache-config.service';
import { AuthMiddleware } from '@/common/middlewares/auth.middleware';
import { RateLimitConfigService } from '@/configs/rate-limit-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        mongoConfig,
        authConfig,
        minioConfig,
        redisConfig,
        pinoLoggerConfig,
      ],
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useClass: RateLimitConfigService,
    }),
    LoggingModule,
    DatabasesModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    PortfoliosModule,
    MinioModule,
    MediaModule,
    BullQueueModule,
    PrometheusModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard, // global rate limit
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('');
  }
}
