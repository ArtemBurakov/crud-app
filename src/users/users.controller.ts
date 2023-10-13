import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/common/guards/userRole.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserUpdateGuard } from 'src/common/guards/userUpdate.guard';
import { ApiBearerAuth, ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
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

  @ApiBearerAuth('jwt')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AccessTokenGuard, UserUpdateGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('jwt')
  @Delete(':id')
  @Roles('admin')
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
