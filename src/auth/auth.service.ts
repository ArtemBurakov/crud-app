import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) throw new BadRequestException('User already exists');

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });

    return this.generateTokens(newUser.id, newUser.username, newUser.role);
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    return this.generateTokens(user.id, user.username, user.role);
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    return this.generateTokens(user.id, user.username, user.role);
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const accessToken = await this.generateToken(
      userId,
      email,
      role,
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRATION,
    );

    const refreshToken = await this.generateToken(
      userId,
      email,
      role,
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRATION,
    );

    await this.updateRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private hashData(data: string) {
    return argon2.hash(data);
  }

  private generateToken(
    userId: number,
    email: string,
    role: string,
    secret: string,
    expiresIn: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
        role,
      },
      {
        secret,
        expiresIn,
      },
    );
  }
}
