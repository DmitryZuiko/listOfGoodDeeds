import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return await this.userModel.find().exec();
  }

  async deleteAll() {
    await this.userModel.deleteMany().exec();
  }

  async findOne(options?: object): Promise<UserDto> {
    return await this.userModel.findOne(options).exec();
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const areEqual = await compare(password, user.password);
    if (!areEqual)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return user;
  }

  async findByUsername({ username }: any): Promise<UserDto> {
    return await this.findOne({ username });
  }

  async findByUsernameExec(username) {
    return await this.userModel.findOne({ username }).exec();
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = userDto;
    const userInDb = await this.userModel.findOne({ username }).exec();
    if (userInDb)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    const user: UserModel = await new this.userModel({
      username,
      password: hashPassword,
      email,
    });
    await user.save();
    return user;
  }

  async setDeedToCurrentUser(_id, deedId) {
    await this.userModel.updateOne({ _id }, { $push: { deedsToDo: deedId } });
  }

  async deleteDeedToCurrentUser(_id, deedId) {
    await this.userModel.updateOne({ _id }, { $pull: { deedsToDo: deedId } });
  }

  async updateUser(_id, body) {
    await this.userModel.findOneAndUpdate({ _id }, { ...body });
  }

  async updateUserRate(_id, deedId, rate, del = false) {
    if (del) {
      return this.userModel.updateOne({ _id }, { $pull: { completeDeeds: deedId }, $set: { rate } },);
    }
    return this.userModel.updateOne({ _id }, { $push: { completeDeeds: deedId }, $set: { rate } },);
  }

  async deleteUser(_id) {
    await this.userModel.deleteOne({ _id });
  }

  async addFriend(user, username) {
    if (user.username === username)
      throw new HttpException('You cant add yourself', HttpStatus.BAD_REQUEST);
    const friend = await this.userModel.findOne({ username });
    await this.userModel.updateOne(
      { _id: user._id },
      { $push: { friends: friend._id } },
    );
  }
}
