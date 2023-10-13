import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostUpdateGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userFromJwt = request.user;
    const routeId = +request.params.id;

    if (userFromJwt.role === 'admin') return true;

    const post = await this.postsService.findOne(routeId);

    if (!post) return false;

    return post.authorId === userFromJwt.sub;
  }
}
