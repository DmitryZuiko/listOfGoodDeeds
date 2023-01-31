import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Param('id') id) {
    return await this.commentsService.getCommentsOfCurrentDeed(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() body: CreateCommentDto) {
    return await this.commentsService.addComment(req.user._id, body);
  }
}
