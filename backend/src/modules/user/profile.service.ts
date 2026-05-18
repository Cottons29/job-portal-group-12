import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { SheepFileService } from '../../common/sheep-file.service';
import { User } from './user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

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
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sheepFileService: SheepFileService,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateStudentProfile(
    userId: string,
    data: any,
    cvFile?: Express.Multer.File,
    avatarFile?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.getProfile(userId);

    if (!data.fullName || !data.university || !data.major) {
      throw new BadRequestException(
        'fullName, university and major are required',
      );
    }

    user.fullName = String(data.fullName);
    user.gender = data.gender ? String(data.gender) : user.gender;
    user.university = String(data.university);
    user.major = String(data.major);
    user.yearLevel = data.yearLevel ? String(data.yearLevel) : user.yearLevel;
    user.yearOfStudy = mapYearLevelToInt(user.yearLevel);
    user.bio = data.bio ? String(data.bio) : user.bio;
    user.jobType = data.jobType ? String(data.jobType) : user.jobType;
    user.currency = data.currency ? String(data.currency) : user.currency;
    user.expectedSalary = data.expectedSalary
      ? String(data.expectedSalary).trim()
      : user.expectedSalary;
    
    if (data.skills) {
      user.skills = parseJsonOrNull<string[]>(data.skills) ?? user.skills;
    }
    
    if (data.availability) {
      user.availability =
        parseJsonOrNull<Record<string, Record<string, boolean>>>(
          data.availability,
        ) ?? user.availability;
    }

    if (data.email) {
      user.email = String(data.email).trim();
    }

    if (data.user_name !== undefined) {
      user.user_name = String(data.user_name).trim() || null;
    }

    if (data.phone) {
      user.phone = String(data.phone).trim();
    }

    if (cvFile) {
      const uploadedFile = await this.sheepFileService.upload(cvFile);
      user.cvUrl = this.toRelativePath(uploadedFile.url);
    }

    if (avatarFile) {
      const uploadedFile = await this.sheepFileService.upload(avatarFile);
      user.profileImageUrl = this.toRelativePath(uploadedFile.url);
    } else if (data.profileImageUrl) {
      user.profileImageUrl = this.toRelativePath(String(data.profileImageUrl));
    }

    try {
      user.profileCompleted = true;
      return await this.userRepository.save(user);
    } catch (e) {
      console.error('Error saving student profile:', e);
      throw new InternalServerErrorException('Failed to save student profile');
    }
  }

  async updateEmployerProfile(
    userId: string,
    data: any,
    logoFile?: Express.Multer.File,
    patentFile?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.getProfile(userId);

    // Merge textual data
    // Map 'location' from frontend to 'address' in entity if needed
    if (data.location && !data.address) {
      data.address = data.location;
    }
    
    // We only want to update specific fields to avoid overwriting password etc if 'data' is too broad
    const allowedFields = [
      'companyName',
      'industry',
      'address',
      'companyDescription',
      'website',
      'phone',
      'email',
      'user_name',
      'logoUrl',
    ];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    }

    // Handle Logo File
    if (logoFile) {
      const uploadedFile = await this.sheepFileService.upload(logoFile);
      user.logoUrl = this.toRelativePath(uploadedFile.url);
    }

    // Handle Patent File
    if (patentFile) {
      const uploadedFile = await this.sheepFileService.upload(patentFile);
      user.patentUrl = this.toRelativePath(uploadedFile.url);

      // Reset verification status if they uploaded a new patent
      user.isVerified = false;
    }

    try {
      user.profileCompleted = true;
      return await this.userRepository.save(user);
    } catch (e) {
      console.error('Error saving employer profile:', e);
      throw new InternalServerErrorException('Failed to save employer profile');
    }
  }

  private toRelativePath(urlOrPath: string): string {
    if (!urlOrPath) return urlOrPath;
    try {
      const url = new URL(urlOrPath);
      // If it's an absolute URL, return just the path + search + hash
      return url.pathname + url.search + url.hash;
    } catch {
      // If it's already a path, return as is
      return urlOrPath;
    }
  }
}
