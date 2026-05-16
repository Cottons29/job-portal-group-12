import {
  IsString,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateEmployerProfileDto {
  @IsString()
  companyName: string;

  @IsUrl()
  patenttUrl: string; 

  @IsString()
  companyDescription: string;

  @IsString()
  industry: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsUrl()
  logoUrl: string;
}