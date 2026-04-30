import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentProfile } from './student-profile.entity';
import { SaveStudentProfileDto } from './dto/save-student-profile.dto';

/**
 * Maps the UI's friendly labels ("Year 1", ..., "Graduate") to the integer
 * stored in `yearOfStudy`. Returns `null` for unknown / empty inputs so the
 * column can stay NULL rather than failing the BETWEEN check.
 */
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

function parseJsonOrNull<T>(raw: string | undefined | null): T | null {
  if (raw == null || raw === '') return null;
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
    private readonly profileRepo: Repository<StudentProfile>,
  ) {}

  /**
   * Upsert a student profile keyed by the (in-memory) session user id.
   * If the user already submitted the form, the existing row is updated;
   * otherwise a new row is inserted.
   */
  async save(
    sessionUserId: string | number | null | undefined,
    dto: SaveStudentProfileDto,
    cv?: Express.Multer.File,
  ): Promise<StudentProfile> {
    if (!dto.fullName || !dto.university || !dto.major) {
      throw new BadRequestException(
        'fullName, university and major are required',
      );
    }

    const sid = sessionUserId == null ? null : String(sessionUserId);

    let profile: StudentProfile | null = null;
    if (sid) {
      profile = await this.profileRepo.findOne({
        where: { sessionUserId: sid },
      });
    }
    if (!profile) {
      profile = this.profileRepo.create();
    }

    profile.sessionUserId = sid ?? null;
    profile.fullName = dto.fullName;
    profile.university = dto.university;
    profile.major = dto.major;
    profile.yearLevel = dto.yearLevel || undefined;
    profile.yearOfStudy = mapYearLevelToInt(dto.yearLevel);
    profile.bio = dto.bio || undefined;
    profile.jobType = dto.jobType || undefined;
    profile.currency = dto.currency || undefined;

    profile.expectedSalary =
      dto.expectedSalary && dto.expectedSalary.trim() !== ''
        ? dto.expectedSalary.trim()
        : null;

    profile.skills = parseJsonOrNull<string[]>(dto.skills) ?? [];
    profile.availability =
      parseJsonOrNull<Record<string, Record<string, boolean>>>(
        dto.availability,
      ) ?? null;

    if (cv) {
      profile.cvUrl = `/uploads/${cv.filename}`;
    }

    return this.profileRepo.save(profile);
  }

  async findBySessionUser(
    sessionUserId: string | number | null | undefined,
  ): Promise<StudentProfile | null> {
    if (sessionUserId == null) return null;
    return this.profileRepo.findOne({
      where: { sessionUserId: String(sessionUserId) },
    });
  }
}
