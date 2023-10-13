import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException(`User not found`);

    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.authorId = user.id;

    return this.postRepository.save(post);
  }

  async findAll() {
    return this.postRepository.find({ relations: ['author'] });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException(`Post not found`);

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    post.title = updatePostDto.title;
    post.content = updatePostDto.content;

    return this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    return this.postRepository.remove(post);
  }
}
