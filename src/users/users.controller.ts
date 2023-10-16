import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUpdateGuard } from '../common/guards/userUpdate.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/userRole.guard';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AccessTokenGuard, UserUpdateGuard)
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access, token missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, access denied for non-admin users.',
  })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(+id);
  }
}
