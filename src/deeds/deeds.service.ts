import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeedModel } from './models/deed.model';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { DeedDto } from './dto/deed.dto';

@Injectable()
export class DeedsService {
  constructor(
    @InjectModel(DeedModel.name)
    private readonly deedModel: Model<DeedModel>,
    private readonly userService: UsersService,
  ) {}
  async createDeed(userId, deedDto: DeedDto) {
    const deed = await this.deedModel.create(deedDto);
    await this.userService.setDeedToCurrentUser(userId, deed._id);
    return deed;
  }

  async getAllDeeds() {
    return await this.deedModel.find().exec();
  }

  async getDeed(_id: string) {
    return await this.deedModel.findOne({ _id }).exec();
  }

  async deleteDeed(user, id) {
    if (this.deedExistence(user.deedsToDo, id)) {
      await this.userService.deleteDeedToCurrentUser(user._id, id);
      return await this.deedModel.deleteOne({ _id: id }).exec();
    }
    throw new HttpException('Deed not found', HttpStatus.NOT_FOUND);
  }

  async updateDeed(user, _id, body) {
    if (this.deedExistence(user.deedsToDo, _id)) {
      return await this.deedModel.updateOne({ _id }, { ...body }).exec();
    }
    throw new HttpException('Deed not found', HttpStatus.NOT_FOUND);
  }

  async showFriendDeeds(user, username) {
    const friend = await this.userService.findByUsernameExec(username);
    return this.deedModel.find().where('_id').in(friend.completeDeeds);
  }

  async addCompleteDeed(user, deedId) {
    if (this.deedExistence(user.deedsToDo, deedId)) {
      await this.userService.deleteDeedToCurrentUser(user._id, deedId);
      const deed = await this.deedModel.findOne({ _id: deedId }).exec();
      const rate = user.rate + deed.rate;
      return await this.userService.updateUserRate(user._id, deedId, rate);
    }
    throw new HttpException('Deed not found', HttpStatus.NOT_FOUND);
  }

  async deleteCompleteDeed(user, deedId) {
    if (this.deedExistence(user.completeDeeds, deedId)) {
      await this.userService.setDeedToCurrentUser(user._id, deedId);
      const deed = await this.deedModel.findOne({ _id: deedId }).exec();
      const rate = user.rate - deed.rate;
      return await this.userService.updateUserRate(user._id, deedId, rate, true);
    }
    throw new HttpException('Deed not found', HttpStatus.NOT_FOUND);
  }

  private deedExistence(userDeeds, deedId) {
    return userDeeds.find((id) => deedId === id.toString());
  }
}
