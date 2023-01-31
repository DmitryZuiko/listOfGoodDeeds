import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeedInterface } from '../intefaces/deed.interface';

@Schema({ collection: 'deeds', timestamps: true })
export class DeedModel extends Document implements DeedInterface {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rate: number;
}

export const DeedSchema = SchemaFactory.createForClass(DeedModel);