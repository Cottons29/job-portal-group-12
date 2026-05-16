import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserRole } from '../../common/enums/user-role.enum';
import { AccountStatus } from '../../common/enums/account-status.enum';
import { PasskeyCredential } from '../../auth/passkey-credential.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  user_name: string | null;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ default: false })
  profileCompleted: boolean;

  // --- Student Specific Fields ---
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  major: string;

  @Column({ type: 'int', nullable: true })
  yearOfStudy?: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  yearLevel?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column('text', {
    array: true,
    default: () => 'ARRAY[]::text[]',
    nullable: true,
  })
  skills: string[];

  @Column({ nullable: true })
  jobType?: string;

  @Column({ type: 'jsonb', nullable: true })
  availability?: Record<string, Record<string, boolean>> | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  expectedSalary?: string | null;

  @Column({ length: 3, nullable: true })
  currency?: string;

  // --- Employer Specific Fields ---
  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  patentUrl: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'text', nullable: true })
  companyDescription: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => PasskeyCredential, (credential) => credential.user)
  passkeyCredentials: PasskeyCredential[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
