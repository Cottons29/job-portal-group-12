import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';

interface FindAllPostsOptions {
  page?: string;
  limit?: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(options: FindAllPostsOptions = {}) {
    const page = Math.max(Number.parseInt(options.page || '1', 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(options.limit || '10', 10) || 10, 1), 50);
    const [posts, total] = await this.postsRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      posts,
      page,
      limit,
      total,
      hasMore: page * limit < total,
    };
  }

  async create(userId: string, dto: CreatePostDto) {
    const title = dto.title?.trim();
    const content = dto.content?.trim();

    if (!title || !content) {
      throw new BadRequestException('Title and content are required');
    }

    if (title.length > 160 || content.length > 5000) {
      throw new BadRequestException('Post title or content is too long');
    }

    const author = await this.usersRepository.findOne({ where: { id: userId } });
    if (!author) {
      throw new NotFoundException('User not found');
    }

    const post = this.postsRepository.create({
      title,
      content,
      imageUrl: dto.imageUrl?.trim() || undefined,
      author,
    });

    return this.postsRepository.save(post);
  }
}