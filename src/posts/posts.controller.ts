import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostUpdateGuard } from 'src/common/guards/postUpdate.guard';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard)
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const userId = request.user['sub'];
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of posts has been successfully retrieved.',
  })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt')
  @ApiBody({ type: UpdatePostDto })
  @UseGuards(AccessTokenGuard, PostUpdateGuard)
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard, PostUpdateGuard)
  @ApiResponse({
    status: 204,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.postsService.remove(+id);
  }
}
