import { registerAs } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export default registerAs(
  'mongo',
  (): MongooseModuleFactoryOptions => ({
    uri:
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/portfolios-api-mongo?directConnection=true',
  }),
);
