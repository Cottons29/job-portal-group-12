import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post(':postId/like')
  @HttpCode(HttpStatus.OK)
  async toggleLike(@Req() req: any, @Param('postId') postId: string) {
    return this.postsService.toggleLike(postId, req.user.sub);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':postId/bookmark')
  @HttpCode(HttpStatus.OK)
  async toggleBookmark(@Req() req: any, @Param('postId') postId: string) {
    return this.postsService.toggleBookmark(postId, req.user.sub);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':postId/share')
  @HttpCode(HttpStatus.CREATED)
  async share(@Req() req: any, @Param('postId') postId: string) {
    return this.postsService.recordShare(postId, req.user.sub);
  }

  @Get(':postId/comments')
  async listComments(@Param('postId') postId: string) {
    const comments = await this.postsService.listComments(postId);
    return { comments };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Req() req: any,
    @Param('postId') postId: string,
    @Body() body: { content?: string },
  ) {
    return this.postsService.addComment(
      postId,
      req.user.sub,
      body.content || '',
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':postId/comments/:commentId')
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Req() req: any,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.postsService.deleteComment(postId, commentId, req.user.sub);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('applied/ids')
  async getAppliedPostIds(@Req() req: any) {
    const ids = await this.postsService.getAppliedPostIds(req.user.sub);
    return { appliedPostIds: ids };
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('role') role?: string,
  ) {
    return this.postsService.findAll({ page, limit, q, role }, req.user?.sub);
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() dto: CreatePostDto) {
    const post = await this.postsService.create(req.user.sub, dto);
    return { message: 'Post created', post };
  }
}
