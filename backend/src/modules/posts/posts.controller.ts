import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AuthenticatedGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();
    return { posts };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() dto: CreatePostDto) {
    const post = await this.postsService.create(req.user.sub, dto);
    return { message: 'Post created', post };
  }
}