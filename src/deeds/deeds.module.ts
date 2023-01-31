import { Module } from '@nestjs/common';
import { DeedsService } from './deeds.service';
import { DeedsController } from './deeds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeedModel, DeedSchema } from './models/deed.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: DeedModel.name,
        schema: DeedSchema,
      },
    ]),
  ],
  providers: [DeedsService],
  controllers: [DeedsController],
})
export class DeedsModule {}
