import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async searchUsers(q: string, currentUserId: string): Promise<any[]> {
    if (!q || q.trim().length < 1) return [];

    const term = `%${q.trim()}%`;
    const users = await this.userRepository.find({
      where: [
        { fullName: ILike(term), id: Not(currentUserId) },
        { companyName: ILike(term), id: Not(currentUserId) },
        { user_name: ILike(term), id: Not(currentUserId) },
      ],
      take: 20,
    });

    return users.map((u) => {
      const isEmployer = u.role === UserRole.EMPLOYER;
      return {
        id: u.id,
        name: isEmployer
          ? u.companyName || u.user_name || 'Company'
          : u.fullName || u.user_name || 'Student',
        handle: u.user_name,
        role: u.role,
        avatar: isEmployer ? u.logoUrl : u.profileImageUrl,
        bio: isEmployer ? u.companyDescription : u.bio,
        university: u.university,
        major: u.major,
        skills: u.skills || [],
        isVerified: u.isVerified,
      };
    });
  }
}
