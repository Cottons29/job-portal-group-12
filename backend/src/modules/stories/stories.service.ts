import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Story } from './story.entity';
import { User } from '../user/user.entity';
import { SheepFileService } from '../../common/sheep-file.service';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sheepFileService: SheepFileService,
  ) {}

  async createStory(
    authorId: string,
    text: string | null,
    bgColor: string | null,
    file?: Express.Multer.File,
  ): Promise<Story> {
    let mediaUrl: string | null = null;
    let type: 'text' | 'photo' = 'text';

    if (file) {
      const uploaded = await this.sheepFileService.upload(file);
      mediaUrl = uploaded.url;
      type = 'photo';
    }

    const story = this.storyRepository.create({
      authorId,
      text: text || null,
      mediaUrl,
      type,
      bgColor: bgColor || '#6366f1',
    });

    return this.storyRepository.save(story);
  }

  async getRecentStories(): Promise<any[]> {
    // Get stories from last 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stories = await this.storyRepository.find({
      where: { createdAt: MoreThan(since) },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });

    // Group by author
    const byAuthor = new Map<string, any>();
    for (const story of stories) {
      const author = story.author;
      if (!byAuthor.has(author.id)) {
        const isEmployer = author.role === UserRole.EMPLOYER;
        byAuthor.set(author.id, {
          id: author.id,
          name: isEmployer
            ? author.companyName || author.user_name || 'Company'
            : author.fullName || author.user_name || 'User',
          avatar: isEmployer ? author.logoUrl : author.profileImageUrl,
          role: author.role,
          stories: [],
        });
      }
      byAuthor.get(author.id).stories.push({
        id: story.id,
        text: story.text,
        mediaUrl: story.mediaUrl,
        type: story.type,
        bgColor: story.bgColor,
        createdAt: story.createdAt,
      });
    }

    return Array.from(byAuthor.values());
  }

  async deleteStory(storyId: string, userId: string): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: storyId } });
    if (!story) throw new NotFoundException('Story not found');
    if (story.authorId !== userId) throw new NotFoundException('Not your story');
    await this.storyRepository.remove(story);
  }
}
