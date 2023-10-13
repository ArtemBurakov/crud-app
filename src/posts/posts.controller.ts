import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PostUpdateGuard } from 'src/common/guards/postUpdate.guard';
import { ApiBearerAuth, ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('jwt')
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
  @UsePipes(ValidationPipe)
  @UseGuards(AccessTokenGuard, PostUpdateGuard)
  @ApiBearerAuth('jwt')
  @ApiBody({ type: UpdatePostDto })
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
  @UseGuards(AccessTokenGuard, PostUpdateGuard)
  @ApiBearerAuth('jwt')
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
