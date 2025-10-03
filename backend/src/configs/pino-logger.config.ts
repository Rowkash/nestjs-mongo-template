import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino/params';

export default registerAs(
  'pinoLogger',
  (): Params => ({
    forRoutes: ['/*path'],
    pinoHttp: {
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["set-cookie"]',
        ],
        censor: '[SENSITIVE]',
      },
      //   transport: {
      //     target: 'pino-socket',
      //     options: {
      //       address: 'localhost',
      //       port: 5000,
      //       mode: 'tcp',
      //     },
      //   },
    },
  }),
);
