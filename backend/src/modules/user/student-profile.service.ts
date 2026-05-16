import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SheepFileService } from '../../common/sheep-file.service';
import { User } from './user.entity';

function mapYearLevelToInt(label?: string | null): number | null {
  if (!label) return null;
  const m = /^Year\s+(\d)$/i.exec(label.trim());
  if (m) {
    const n = Number.parseInt(m[1], 10);
    return n >= 1 && n <= 4 ? n : null;
  }
  if (label.trim().toLowerCase() === 'graduate') return 5;
  return null;
}

function parseJsonOrNull<T>(raw: unknown): T | null {
  if (raw == null || raw === '') return null;
  if (typeof raw !== 'string') return raw as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new BadRequestException(`Malformed JSON payload: ${raw}`);
  }
}

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sheepFileService: SheepFileService,
  ) {}

  async createOrUpdateProfile(
    userId: string,
    data: Record<string, unknown>,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!data.fullName || !data.university || !data.major) {
      throw new BadRequestException(
        'fullName, university and major are required',
      );
    }

    user.fullName = String(data.fullName);
    user.gender = data.gender ? String(data.gender) : undefined;
    user.university = String(data.university);
    user.major = String(data.major);
    user.yearLevel = data.yearLevel ? String(data.yearLevel) : undefined;
    user.yearOfStudy = mapYearLevelToInt(user.yearLevel);
    user.bio = data.bio ? String(data.bio) : undefined;
    user.jobType = data.jobType ? String(data.jobType) : undefined;
    user.currency = data.currency ? String(data.currency) : undefined;
    user.expectedSalary = data.expectedSalary
      ? String(data.expectedSalary).trim()
      : null;
    user.skills = parseJsonOrNull<string[]>(data.skills) ?? [];
    user.availability =
      parseJsonOrNull<Record<string, Record<string, boolean>>>(
        data.availability,
      ) ?? null;

    if (data.email) {
      user.email = String(data.email).trim();
    }

    if (data.user_name !== undefined) {
      user.user_name = String(data.user_name).trim() || null;
    }

    if (data.phone) {
      user.phone = String(data.phone).trim();
    }

    if (file) {
      const uploadedFile = await this.sheepFileService.upload(file);
      user.cvUrl = uploadedFile.url;
    }

    if (data.profileImageUrl) {
      user.profileImageUrl = String(data.profileImageUrl);
    }

    try {
      user.profileCompleted = true;
      return await this.userRepository.save(user);
    } catch (e) {
      console.error('Error saving profile:', e);
      throw new InternalServerErrorException('Failed to save student profile');
    }
  }

  async findByUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}
