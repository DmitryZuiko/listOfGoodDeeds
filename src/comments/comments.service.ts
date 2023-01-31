import { Injectable } from '@nestjs/common';
import { CommentModel } from './models/comment.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentModel>,
  ) {}

  async addComment(userId: string, body) {
    try {
      const comment = await this.commentModel.create({
        ...body,
        userId,
      });
      await comment.save();
      return comment;
    } catch (e) {
      console.log(e);
    }
  }

  async getCommentsOfCurrentDeed(deedId: string) {
    return await this.commentModel.find({ deedId }).exec();
  }
}
