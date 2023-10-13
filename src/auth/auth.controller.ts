import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'Authentication successful.' })
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Get('logout')
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard)
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  @ApiBearerAuth('jwt-refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
