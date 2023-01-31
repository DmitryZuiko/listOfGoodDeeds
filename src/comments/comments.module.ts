import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModel, CommentSchema } from './models/comment.model';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CommentModel.name,
        schema: CommentSchema,
      },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
