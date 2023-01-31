import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const getMongoString = (configService: ConfigService) =>
  // 'mongodb://admin:admin@127.0.0.1:27018/admin';
  'mongodb://' +
  configService.get('DB_LOGIN') +
  ':' +
  configService.get('DB_PASSWORD') +
  '@' +
  configService.get('DB_HOST') +
  ':' +
  configService.get('DB_PORT') +
  '/' +
  configService.get('DB_AUTHDATABASE');

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  try {
    return {
      uri: getMongoString(configService),
      ...getMongoOptions(),
    };
  } catch (e) {
    console.log(e);
  }
};
