import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from './student-profile.entity';
import { User } from '../user/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly profileRepository: Repository<StudentProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrUpdateProfile(userId: string, data: any, file?: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = await this.profileRepository.findOne({ where: { userId } });

    if (!profile) {
      profile = this.profileRepository.create({
        userId,
        user,
      });
    }

    // Merge data
    Object.assign(profile, data);

    // Handle File Upload Manually (if UploadModule is not connected directly)
    if (file) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `${userId}-${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      profile.cvUrl = `/uploads/${filename}`;
    }

    try {
      const savedProfile = await this.profileRepository.save(profile);
      user.profileCompleted = true;
      await this.userRepository.save(user);
      return savedProfile;
    } catch (e) {
      console.error('Error saving profile:', e);
      throw new InternalServerErrorException('Failed to save student profile');
    }
  }
}
