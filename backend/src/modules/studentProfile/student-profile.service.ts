import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {SheepFileService} from '../../common/sheep-file.service';
import {User} from '../user/user.entity';
import {StudentProfile} from './student-profile.entity';

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
        @InjectRepository(StudentProfile)
        private readonly profileRepository: Repository<StudentProfile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly sheepFileService: SheepFileService,
    ) {
    }

    async createOrUpdateProfile(
        userId: string,
        data: Record<string, unknown>,
        file?: Express.Multer.File,
    ): Promise<StudentProfile> {
        const user = await this.userRepository.findOne({where: {id: userId}});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        let profile = await this.profileRepository.findOne({where: {userId}});

        if (!profile) {
            profile = this.profileRepository.create({
                userId,
                user,
                sessionUserId: userId,
            });
        }

        if (!data.fullName || !data.university || !data.major) {
            throw new BadRequestException(
                'fullName, university and major are required',
            );
        }

        profile.user = user;
        profile.userId = userId;
        profile.sessionUserId = userId;
        profile.fullName = String(data.fullName);
        profile.gender = data.gender ? String(data.gender) : undefined;
        profile.phone = data.phone ? String(data.phone) : undefined;
        profile.university = String(data.university);
        profile.major = String(data.major);
        profile.yearLevel = data.yearLevel ? String(data.yearLevel) : undefined;
        profile.yearOfStudy = mapYearLevelToInt(profile.yearLevel);
        profile.bio = data.bio ? String(data.bio) : undefined;
        profile.jobType = data.jobType ? String(data.jobType) : undefined;
        profile.currency = data.currency ? String(data.currency) : undefined;
        profile.expectedSalary = data.expectedSalary
            ? String(data.expectedSalary).trim()
            : null;
        profile.skills = parseJsonOrNull<string[]>(data.skills) ?? [];
        profile.availability =
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
            profile.cvUrl = uploadedFile.url;
        }

        if (data.profileImageUrl) {
            profile.profileImageUrl = String(data.profileImageUrl);
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

    async findByUser(userId: string): Promise<StudentProfile | null> {
        return this.profileRepository.findOne({where: {userId}});
    }
}
