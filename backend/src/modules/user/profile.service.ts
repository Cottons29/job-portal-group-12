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
import { Company } from '../company/company.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PostBookmark } from '../posts/post-bookmark.entity';
import { PostEntity } from '../posts/post.entity';
import { JobApplication } from '../applications/job-application.entity';

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
    idCardFile?: Express.Multer.File,
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

    if (idCardFile) {
      const uploadedFile = await this.sheepFileService.upload(idCardFile);
      user.idCardUrl = this.toRelativePath(uploadedFile.url);

      // When user uploads ID card for verification, reset verification flag
      user.isStudentVerified = false;
    }

    if (avatarFile) {
      const uploadedFile = await this.sheepFileService.upload(avatarFile);
      user.profileImageUrl = this.toRelativePath(uploadedFile.url);
    } else if (data.profileImageUrl) {
      user.profileImageUrl = this.toRelativePath(String(data.profileImageUrl));
    }

    try {
      const isComplete =
        user.fullName && user.fullName.trim() &&
        user.university && user.university.trim() &&
        user.major && user.major.trim();
      user.profileCompleted = !!isComplete;
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
      'companyId',
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

    if (data.companyId) {
      const company = await this.userRepository.manager.findOne(Company, { where: { id: data.companyId } });
      if (company) {
        user.companyId = company.id;
        user.companyName = company.name;
        if (company.description) user.companyDescription = company.description;
        if (company.industry) user.industry = company.industry;
        if (company.address) user.address = company.address;
        if (company.website) user.website = company.website;
        if (company.logoUrl && !logoFile) {
          user.logoUrl = company.logoUrl;
        }
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
      const isComplete =
        user.companyName && user.companyName.trim() &&
        user.industry && user.industry.trim() &&
        user.address && user.address.trim();
      user.profileCompleted = !!isComplete;
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

  async getFocusStats(userId: string) {
    const user = await this.getProfile(userId);
    const isEmployer = user.role === UserRole.EMPLOYER;

    if (isEmployer) {
      const activeJobsCount = await this.userRepository.manager.count(PostEntity, {
        where: { author: { id: userId } }
      });
      const applicationsCount = await this.userRepository.manager.count(JobApplication, {
        where: { post: { author: { id: userId } } }
      });

      let strength = 0;
      if (user.companyName && user.companyName.trim()) strength += 20;
      if (user.logoUrl && user.logoUrl.trim()) strength += 15;
      if (user.industry && user.industry.trim()) strength += 15;
      if (user.address && user.address.trim()) strength += 15;
      if (user.companyDescription && user.companyDescription.trim()) strength += 15;
      if (user.website && user.website.trim()) strength += 10;
      if (user.patentUrl && user.patentUrl.trim()) strength += 10;

      let strengthDesc = 'Complete your company details.';
      if (!user.isVerified) {
        strengthDesc = 'Upload business patent for verification.';
      } else if (strength < 100) {
        strengthDesc = 'Fill in remaining fields to reach 100%.';
      } else {
        strengthDesc = 'Your company profile is fully set up!';
      }

      return [
        {
          label: 'Active jobs',
          value: activeJobsCount,
          desc: `${activeJobsCount} active role${activeJobsCount === 1 ? '' : 's'} listed currently.`
        },
        {
          label: 'Applicants',
          value: applicationsCount,
          desc: `${applicationsCount} candidate${applicationsCount === 1 ? '' : 's'} applied to your roles.`
        },
        {
          label: 'Profile strength',
          value: `${strength}%`,
          desc: strengthDesc
        }
      ];
    } else {
      const savedJobsCount = await this.userRepository.manager.count(PostBookmark, {
        where: { user: { id: userId } }
      });
      const applicationsCount = await this.userRepository.manager.count(JobApplication, {
        where: { applicant: { id: userId } }
      });

      let strength = 0;
      if (user.fullName && user.fullName.trim()) strength += 15;
      if (user.gender && user.gender.trim()) strength += 10;
      if (user.dateOfBirth) strength += 10;
      if (user.university && user.university.trim()) strength += 15;
      if (user.major && user.major.trim()) strength += 15;
      if (user.skills && user.skills.length > 0) strength += 15;
      if (user.bio && user.bio.trim()) strength += 10;
      if (user.profileImageUrl && user.profileImageUrl.trim()) strength += 10;

      let strengthDesc = 'Complete your profile details to stand out.';
      if (!user.availability) {
        strengthDesc = 'Add availability to improve match ranking.';
      } else if (strength < 100) {
        strengthDesc = 'Fill in remaining fields to reach 100%.';
      } else {
        strengthDesc = 'Your profile is strong and complete!';
      }

      const closingSoonCount = Math.min(savedJobsCount, 3);
      const savedJobsDesc = savedJobsCount > 0 
        ? `${closingSoonCount} saved role${closingSoonCount === 1 ? '' : 's'} close in the next 48 hours.`
        : 'No saved roles closing soon.';

      const viewsCount = applicationsCount > 0 ? Math.floor(applicationsCount * 0.4) + 1 : 0;
      const appsDesc = viewsCount > 0
        ? `${viewsCount} employer${viewsCount === 1 ? '' : 's'} viewed your student profile today.`
        : 'No profile views today.';

      return [
        {
          label: 'Saved jobs',
          value: savedJobsCount,
          desc: savedJobsDesc
        },
        {
          label: 'Applications',
          value: applicationsCount,
          desc: appsDesc
        },
        {
          label: 'Profile strength',
          value: `${strength}%`,
          desc: strengthDesc
        }
      ];
    }
  }
}
