import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment } from '../interfaces/comment.interface';
import { DeedModel } from '../../deeds/models/deed.model';
import { UserModel } from '../../users/models/user.model';

@Schema({ collection: 'comments', timestamps: true })
export class CommentModel extends Document implements Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: DeedModel.name })
  deedId: DeedModel;

  @Prop({ type: Types.ObjectId, ref: UserModel.name })
  userId: UserModel;
}
export const CommentSchema = SchemaFactory.createForClass(CommentModel);
