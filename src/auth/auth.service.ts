import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { LoginStatus } from './interfaces/login-status.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this._createToken(user);
    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByUsername(payload);
    if (!user)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    return user;
  }

  private _createToken({ username }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN + '';
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return { expiresIn, accessToken };
  }
}
