import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsUrl,
} from 'class-validator';

export class CreateStudentProfileDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsString()
  phone: string;

  @IsString()
  university: string;

  @IsString()
  major: string;

  @IsInt()
  @Min(1)
  @Max(4)
  yearOfStudy: number;

  @IsString()
  bio: string;

  @IsUrl()
  cvUrl: string;

  @IsUrl()
  profileImageUrl: string;
}