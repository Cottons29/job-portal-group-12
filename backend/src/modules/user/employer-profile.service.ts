import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmployerProfileService {
  constructor(
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

    // Merge textual data
    Object.assign(user, data);

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle Logo File
    if (logoFile) {
      const logoFilename = `logo-${userId}-${Date.now()}-${logoFile.originalname}`;
      const logoFilePath = path.join(uploadDir, logoFilename);
      fs.writeFileSync(logoFilePath, logoFile.buffer);
      user.logoUrl = `/uploads/${logoFilename}`;
    }

    // Handle Patent File
    if (patentFile) {
      const patentFilename = `patent-${userId}-${Date.now()}-${patentFile.originalname}`;
      const patentFilePath = path.join(uploadDir, patentFilename);
      //@ts-ignore
      fs.writeFileSync(
        patentFilePath,
        //@ts-ignore
        (patentFile.bufferUrl = `/uploads/${patentFilename}`),
      );

      // Reset verification status if they uploaded a new patent
      user.isVerified = false;
    }

    try {
      // Update User profile completed flag
      user.profileCompleted = true;
      return await this.userRepository.save(user);
    } catch (e) {
      console.error('Error saving employer profile:', e);
      throw new InternalServerErrorException('Failed to save employer profile');
    }
  }

  async getProfileByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
