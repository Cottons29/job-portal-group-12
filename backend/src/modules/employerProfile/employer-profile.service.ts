import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployerProfile } from './company-profile.entity';
import { User } from '../user/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmployerProfileService {
  constructor(
    @InjectRepository(EmployerProfile)
    private readonly profileRepository: Repository<EmployerProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrUpdateProfile(
    userId: string,
    data: any,
    logoFile?: Express.Multer.File,
    patentFile?: Express.Multer.File,
  ) {
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

    // Merge textual data
    Object.assign(profile, data);

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle Logo File
    if (logoFile) {
      const logoFilename = `logo-${userId}-${Date.now()}-${logoFile.originalname}`;
      const logoFilePath = path.join(uploadDir, logoFilename);
      fs.writeFileSync(logoFilePath, logoFile.buffer);
      profile.logoUrl = `/uploads/${logoFilename}`;
    }

    // Handle Patent File
    if (patentFile) {
      const patentFilename = `patent-${userId}-${Date.now()}-${patentFile.originalname}`;
      const patentFilePath = path.join(uploadDir, patentFilename);
      fs.writeFileSync(patentFilePath, patentFile.buffer);
      profile.patentUrl = `/uploads/${patentFilename}`;
      
      // Reset verification status if they uploaded a new patent
      profile.isVerified = false;
    }

    try {
      const savedProfile = await this.profileRepository.save(profile);
      
      // Update User profile completed flag
      user.profileCompleted = true;
      await this.userRepository.save(user);
      
      return savedProfile;
    } catch (e) {
      console.error('Error saving employer profile:', e);
      throw new InternalServerErrorException('Failed to save employer profile');
    }
  }
}
