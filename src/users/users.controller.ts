import {
  Body,
  Controller,
  Delete,
  Req,
  UseGuards,
  Patch,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getAll() {
    return await this.usersService.findAll();
  }

  @Delete('all')
  async deleteAll() {
    return await this.usersService.deleteAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateOne(@Req() req, @Body() body) {
    return await this.usersService.updateUser(req.user._id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteOne(@Req() req) {
    return await this.usersService.deleteUser(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('friend')
  async addFriend(@Req() req, @Body() body) {
    return await this.usersService.addFriend(req.user, body.username);
  }
}
