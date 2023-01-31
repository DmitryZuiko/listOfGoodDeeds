import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { DeedModel } from '../../deeds/models/deed.model';

@Schema({ collection: 'users', timestamps: true })
export class UserModel extends Document implements User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 0 })
  rate: number;

  @Prop({ type: [Types.ObjectId], ref: DeedModel.name })
  deedsToDo: DeedModel[];

  @Prop({ type: [Types.ObjectId], ref: DeedModel.name })
  completeDeeds: DeedModel[];

  @Prop({ type: [Types.ObjectId], ref: UserModel.name })
  friends: UserModel[];
}
export const UserSchema = SchemaFactory.createForClass(UserModel);
