import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async toggleFollow(followerId: string, followingId: string): Promise<{ followed: boolean }> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepository.findOneBy({ id: followerId });
    const following = await this.userRepository.findOneBy({ id: followingId });

    if (!follower || !following) {
      throw new BadRequestException('User not found');
    }

    const existing = await this.followRepository.findOneBy({
      follower: { id: followerId },
      following: { id: followingId },
    });

    if (existing) {
      await this.followRepository.remove(existing);
      return { followed: false };
    } else {
      const follow = this.followRepository.create({ follower, following });
      await this.followRepository.save(follow);
      return { followed: true };
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const count = await this.followRepository.countBy({
      follower: { id: followerId },
      following: { id: followingId },
    });
    return count > 0;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower', 'follower.studentProfile', 'follower.employerProfile'],
    });
    return follows.map(f => f.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following', 'following.studentProfile', 'following.employerProfile'],
    });
    return follows.map(f => f.following);
  }
}
