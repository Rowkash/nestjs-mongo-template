import { LoggerModule } from 'nestjs-pino';
import { Params } from 'nestjs-pino/params';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Params, true>) =>
        configService.get<Params>('pinoLogger', { infer: true }),
    }),
  ],
})
export class LoggingModule {}
