import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';

import { NotificationsService } from '../../notifications/notifications.service';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostBookmark } from './post-bookmark.entity';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostEntity } from './post.entity';
import { PostShare } from './post-share.entity';
import { JobApplication } from '../applications/job-application.entity';

interface FindAllPostsOptions {
  page?: string;
  limit?: string;
  q?: string;
  role?: string;
  authorId?: string;
  status?: string;
}

type EngagementBundle = {
  likeCount: Map<string, number>;
  commentCount: Map<string, number>;
  shareCount: Map<string, number>;
  bookmarkCount: Map<string, number>;
  likedIds: Set<string>;
  bookmarkedIds: Set<string>;
};

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PostLike)
    private readonly postLikesRepository: Repository<PostLike>,
    @InjectRepository(PostComment)
    private readonly postCommentsRepository: Repository<PostComment>,
    @InjectRepository(PostShare)
    private readonly postSharesRepository: Repository<PostShare>,
    @InjectRepository(PostBookmark)
    private readonly postBookmarksRepository: Repository<PostBookmark>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationsRepository: Repository<JobApplication>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(options: FindAllPostsOptions = {}, viewerId?: string) {
    const page = Math.max(Number.parseInt(options.page || '1', 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(options.limit || '10', 10) || 10, 1),
      50,
    );

    const whereCondition: Record<string, unknown>[] = [];
    
    let statusFilter: string | undefined = undefined;
    if (options.status) {
      if (options.status !== 'all') {
        statusFilter = options.status;
      }
    } else if (!options.authorId) {
      statusFilter = 'approved';
    }

    if (options.q) {
      const q = `%${options.q}%`;
      const roleFilter =
        options.role && options.role.toLowerCase() !== 'all'
          ? { author: { role: options.role.toUpperCase() } }
          : {};
      const authorFilter = options.authorId ? { author: { id: options.authorId } } : {};
      const statusFilterObj = statusFilter ? { status: statusFilter } : {};

      whereCondition.push(
        { title: ILike(q), ...roleFilter, ...authorFilter, ...statusFilterObj },
        { content: ILike(q), ...roleFilter, ...authorFilter, ...statusFilterObj },
      );
    } else {
      const condition: any = {};
      if (options.role && options.role.toLowerCase() !== 'all') {
        condition.author = { ...condition.author, role: options.role.toUpperCase() };
      }
      if (options.authorId) {
        condition.author = { ...condition.author, id: options.authorId };
      }
      if (statusFilter) {
        condition.status = statusFilter;
      }
      if (Object.keys(condition).length > 0 || statusFilter) {
        whereCondition.push(condition);
      }
    }

    const findOptions: Record<string, unknown> = {
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    if (whereCondition.length > 0) {
      findOptions.where = whereCondition;
    }

    const [posts, total] = await this.postsRepository.findAndCount(findOptions);
    const engagement = await this.loadEngagement(
      posts.map((p) => p.id),
      viewerId,
    );

    return {
      posts: posts.map((p) => this.serializePost(p, engagement)),
      page,
      limit,
      total,
      hasMore: page * limit < total,
    };
  }

  async findOne(postId: string, viewerId?: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const engagement = await this.loadEngagement([post.id], viewerId);
    return this.serializePost(post, engagement);
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

    const author = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!author) {
      throw new NotFoundException('User not found');
    }

    const post = this.postsRepository.create({
      title,
      content,
      imageUrl: this.toRelativePath(dto.imageUrl?.trim() || undefined),
      author,
      isJob: Boolean(dto.isJob),
      salary: dto.salary?.trim() || undefined,
      location: dto.location?.trim() || undefined,
      jobType: dto.jobType?.trim() || undefined,
      language: dto.language?.trim() || undefined,
      schedule: dto.schedule?.trim() || undefined,
      paymentType: dto.paymentType?.trim() || undefined,
      hiresNeeded: dto.hiresNeeded,
      deadline: dto.deadline?.trim() || undefined,
      skills: dto.skills || [],
      requirements: dto.requirements || [],
    });

    const saved = await this.postsRepository.save(post);
    const engagement = await this.loadEngagement([saved.id], userId);
    return this.serializePost(saved, engagement);
  }

  async toggleLike(postId: string, userId: string) {
    await this.requireUser(userId);
    const post = await this.getPostWithAuthor(postId);

    const existing = await this.postLikesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['post', 'user'],
    });

    if (existing) {
      await this.postLikesRepository.remove(existing);
    } else {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
      await this.postLikesRepository.save(
        this.postLikesRepository.create({ post, user }),
      );
    }

    const likeCount = await this.postLikesRepository.count({
      where: { post: { id: postId } },
    });
    const liked = Boolean(
      await this.postLikesRepository.findOne({
        where: { post: { id: postId }, user: { id: userId } },
      }),
    );

    return { liked, likeCount };
  }

  async toggleBookmark(postId: string, userId: string) {
    await this.requireUser(userId);
    const post = await this.getPostWithAuthor(postId);

    const existing = await this.postBookmarksRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['post', 'user'],
    });

    if (existing) {
      await this.postBookmarksRepository.remove(existing);
    } else {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
      await this.postBookmarksRepository.save(
        this.postBookmarksRepository.create({ post, user }),
      );
    }

    const bookmarkCount = await this.postBookmarksRepository.count({
      where: { post: { id: postId } },
    });
    const bookmarked = Boolean(
      await this.postBookmarksRepository.findOne({
        where: { post: { id: postId }, user: { id: userId } },
      }),
    );

    return { bookmarked, bookmarkCount };
  }

  async recordShare(postId: string, userId: string) {
    await this.requireUser(userId);
    const post = await this.getPostWithAuthor(postId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.postSharesRepository.save(
      this.postSharesRepository.create({ post, user }),
    );

    const shareCount = await this.postSharesRepository.count({
      where: { post: { id: postId } },
    });
    return { shareCount };
  }

  async flagPost(postId: string, userId: string) {
    await this.requireUser(userId);
    const post = await this.getPostWithAuthor(postId);
    post.status = 'flagged';
    await this.postsRepository.save(post);
    return { success: true, message: 'Post flagged for moderation' };
  }

  async listComments(postId: string) {
    await this.ensurePostExists(postId);
    const comments = await this.postCommentsRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
      take: 100,
    });

    return comments.map((c) => this.serializeComment(c));
  }

  async addComment(postId: string, userId: string, rawContent: string) {
    await this.requireUser(userId);
    const post = await this.getPostWithAuthor(postId);
    const content = rawContent?.trim() || '';
    if (!content) {
      throw new BadRequestException('Comment cannot be empty');
    }
    if (content.length > 2000) {
      throw new BadRequestException('Comment is too long');
    }

    const author = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!author) throw new NotFoundException('User not found');

    const saved = await this.postCommentsRepository.save(
      this.postCommentsRepository.create({ post, author, content }),
    );

    const reloaded = await this.postCommentsRepository.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });

    if (post.author.id !== userId) {
      const name = author.user_name || author.phone || 'Someone';
      this.notificationsService
        .createNotification(
          post.author.id,
          `${name} commented on "${post.title}"`,
        )
        .catch(() => undefined);
    }

    const commentCount = await this.postCommentsRepository.count({
      where: { post: { id: postId } },
    });

    return { comment: this.serializeComment(reloaded!), commentCount };
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const comment = await this.postCommentsRepository.findOne({
      where: { id: commentId, post: { id: postId } },
      relations: ['author'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.postCommentsRepository.remove(comment);
    const commentCount = await this.postCommentsRepository.count({
      where: { post: { id: postId } },
    });
    return { commentCount };
  }

  async getAppliedPostIds(userId: string): Promise<string[]> {
    const applications = await this.jobApplicationsRepository.find({
      where: { applicant: { id: userId } },
      relations: ['post'],
    });
    return applications.map((app) => app.post.id);
  }

  async getBookmarkedPosts(userId: string) {
    await this.requireUser(userId);

    const bookmarks = await this.postBookmarksRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.author'],
      order: { createdAt: 'DESC' },
    });

    const posts = bookmarks.map((b) => b.post);
    const engagement = await this.loadEngagement(posts.map((p) => p.id), userId);

    return { posts: posts.map((p) => this.serializePost(p, engagement)) };
  }

  private async ensurePostExists(postId: string) {
    const exists = await this.postsRepository.exist({ where: { id: postId } });
    if (!exists) throw new NotFoundException('Post not found');
  }

  private async getPostWithAuthor(postId: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  private async requireUser(userId: string) {
    const ok = await this.usersRepository.exist({ where: { id: userId } });
    if (!ok) throw new NotFoundException('User not found');
  }

  private serializeComment(comment: PostComment) {
    const isEmp = comment.author.role?.toLowerCase() === 'employer';
    const name = isEmp ? comment.author.companyName : comment.author.fullName;
    const avatar = isEmp ? comment.author.logoUrl : comment.author.profileImageUrl;
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: {
        id: comment.author.id,
        user_name: comment.author.user_name,
        phone: comment.author.phone,
        name: name || comment.author.phone,
        avatar: this.toRelativePath(avatar),
      },
    };
  }

  private serializePost(post: PostEntity, engagement: EngagementBundle) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: this.toRelativePath(post.imageUrl),
      isJob: post.isJob,
      status: post.status,
      salary: post.salary,
      location: post.location,
      jobType: post.jobType,
      language: post.language,
      schedule: post.schedule,
      paymentType: post.paymentType,
      hiresNeeded: post.hiresNeeded,
      deadline: post.deadline,
      skills: post.skills || [],
      requirements: post.requirements || [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      likeCount: engagement.likeCount.get(post.id) ?? 0,
      commentCount: engagement.commentCount.get(post.id) ?? 0,
      shareCount: engagement.shareCount.get(post.id) ?? 0,
      bookmarkCount: engagement.bookmarkCount.get(post.id) ?? 0,
      likedByMe: engagement.likedIds.has(post.id),
      bookmarkedByMe: engagement.bookmarkedIds.has(post.id),
    };
  }

  private toRelativePath(urlOrPath?: string): string | undefined {
    if (!urlOrPath) return urlOrPath;
    try {
      const url = new URL(urlOrPath);
      return url.pathname + url.search + url.hash;
    } catch {
      return urlOrPath;
    }
  }

  private async loadEngagement(
    postIds: string[],
    viewerId?: string,
  ): Promise<EngagementBundle> {
    const emptyBundle = (): EngagementBundle => ({
      likeCount: new Map(),
      commentCount: new Map(),
      shareCount: new Map(),
      bookmarkCount: new Map(),
      likedIds: new Set(),
      bookmarkedIds: new Set(),
    });

    if (!postIds.length) {
      return emptyBundle();
    }

    const [likeRows, commentRows, shareRows, bookmarkRows] = await Promise.all([
      this.postLikesRepository
        .createQueryBuilder('l')
        .select('l.post_id', 'postId')
        .addSelect('COUNT(*)', 'cnt')
        .where('l.post_id IN (:...ids)', { ids: postIds })
        .groupBy('l.post_id')
        .getRawMany(),
      this.postCommentsRepository
        .createQueryBuilder('c')
        .select('c.post_id', 'postId')
        .addSelect('COUNT(*)', 'cnt')
        .where('c.post_id IN (:...ids)', { ids: postIds })
        .groupBy('c.post_id')
        .getRawMany(),
      this.postSharesRepository
        .createQueryBuilder('s')
        .select('s.post_id', 'postId')
        .addSelect('COUNT(*)', 'cnt')
        .where('s.post_id IN (:...ids)', { ids: postIds })
        .groupBy('s.post_id')
        .getRawMany(),
      this.postBookmarksRepository
        .createQueryBuilder('b')
        .select('b.post_id', 'postId')
        .addSelect('COUNT(*)', 'cnt')
        .where('b.post_id IN (:...ids)', { ids: postIds })
        .groupBy('b.post_id')
        .getRawMany(),
    ]);

    const toMap = (rows: { postId: string; cnt: string }[]) => {
      const m = new Map<string, number>();
      for (const row of rows) {
        m.set(row.postId, Number(row.cnt));
      }
      return m;
    };

    const bundle = emptyBundle();
    bundle.likeCount = toMap(likeRows as { postId: string; cnt: string }[]);
    bundle.commentCount = toMap(
      commentRows as { postId: string; cnt: string }[],
    );
    bundle.shareCount = toMap(shareRows as { postId: string; cnt: string }[]);
    bundle.bookmarkCount = toMap(
      bookmarkRows as { postId: string; cnt: string }[],
    );

    if (viewerId) {
      const [liked, bookmarked] = await Promise.all([
        this.postLikesRepository.find({
          where: { user: { id: viewerId }, post: { id: In(postIds) } },
          relations: ['post'],
        }),
        this.postBookmarksRepository.find({
          where: { user: { id: viewerId }, post: { id: In(postIds) } },
          relations: ['post'],
        }),
      ]);
      for (const row of liked) {
        bundle.likedIds.add(row.post.id);
      }
      for (const row of bookmarked) {
        bundle.bookmarkedIds.add(row.post.id);
      }
    }

    return bundle;
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private matchWord(text: string, word: string): boolean {
    if (!word || !text) return false;
    const escaped = this.escapeRegExp(word.toLowerCase());
    const pattern = `(?<=^|[^a-zA-Z0-9_#+.\\-])` + escaped + `(?=$|[^a-zA-Z0-9_#+.\\-])`;
    const regex = new RegExp(pattern, 'i');
    return regex.test(text);
  }

  async findRecommendations(userId: string) {
    const student = await this.usersRepository.findOne({ where: { id: userId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const jobs = await this.postsRepository.find({
      where: { isJob: true, status: 'approved' },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    const studentSkills = student.skills || [];
    const studentMajor = student.major || '';
    const studentJobType = student.jobType || '';

    const scoredJobs = jobs.map((job) => {
      let score = 0;
      const titleLower = (job.title || '').toLowerCase();
      const contentLower = (job.content || '').toLowerCase();
      const jobSkills = job.skills || [];

      // 1. Major Match (Weight: 30%)
      if (studentMajor && this.matchWord(titleLower + ' ' + contentLower, studentMajor)) {
        score += 30;
      }

      // 2. Skill Matching (Weight: 50%)
      let matchedSkillsCount = 0;
      if (jobSkills.length > 0) {
        // Compare array intersections case-insensitively
        const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
        studentSkills.forEach((skill) => {
          if (skill && jobSkillsLower.includes(skill.toLowerCase())) {
            matchedSkillsCount++;
          }
        });
        const matchRatio = matchedSkillsCount / jobSkills.length;
        score += matchRatio * 50;
      } else {
        // Fallback to text parsing if no structured skills on job
        studentSkills.forEach((skill) => {
          if (skill && this.matchWord(titleLower + ' ' + contentLower, skill)) {
            matchedSkillsCount++;
          }
        });
        score += Math.min(matchedSkillsCount * 10, 50);
      }

      // 3. Job Type Match (Weight: 20%)
      if (studentJobType && job.jobType && (
        studentJobType.toLowerCase() === job.jobType.toLowerCase() ||
        this.matchWord(titleLower, studentJobType)
      )) {
        score += 20;
      }

      // 4. Recency Boost (Max 10%)
      const daysOld = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(10 - daysOld, 0);
      score += recencyBoost;

      // Cap final score at 100%
      const finalScore = Math.min(Math.round(score), 100);

      return {
        job,
        score: finalScore,
      };
    });

    scoredJobs.sort((a, b) => b.score - a.score);

    const jobIds = scoredJobs.map((sj) => sj.job.id);
    const engagement = await this.loadEngagement(jobIds, userId);

    return {
      recommendations: scoredJobs.map((sj) => ({
        ...this.serializePost(sj.job, engagement),
        matchScore: sj.score,
      })),
    };
  }
}
