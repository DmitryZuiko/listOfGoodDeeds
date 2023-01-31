import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginStatus } from './interfaces/login-status.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success)
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    return result;
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
}
