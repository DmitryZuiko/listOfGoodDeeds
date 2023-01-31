import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeedsService } from './deeds.service';
import { AuthGuard } from '@nestjs/passport';
import { DeedDto } from './dto/deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@Controller('deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createDeed(@Req() req, @Body() deedsDto: DeedDto) {
    return await this.deedsService.createDeed(req.user._id, deedsDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllDeeds() {
    return await this.deedsService.getAllDeeds();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friend')
  async showFriendDeeds(@Req() req, @Body() body) {
    return await this.deedsService.showFriendDeeds(req.user, body.username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getDeed(@Req() req, @Param('id') id) {
    return await this.deedsService.getDeed(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteDeed(@Req() req, @Body() body) {
    return await this.deedsService.deleteDeed(req.user, body.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('complete')
  async addCompleteDeed(@Req() req, @Body() body) {
    return await this.deedsService.addCompleteDeed(req.user, body.id);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateDeed(@Req() req, @Param('id') id, @Body() deedsDto: UpdateDeedDto) {
    return await this.deedsService.updateDeed(req.user, id, deedsDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('complete')
  async deleteCompleteDeed(@Req() req, @Body() body) {
    return await this.deedsService.deleteCompleteDeed(req.user, body.id);
  }
}
