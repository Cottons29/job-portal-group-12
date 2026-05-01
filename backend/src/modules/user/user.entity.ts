import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { UserRole } from '../../common/enums/user-role.enum';
import { AccountStatus } from '../../common/enums/account-status.enum';
import { StudentProfile } from '../studentProfile/student-profile.entity';
import { EmployerProfile } from '../employerProfile/company-profile.entity';
import { PasskeyCredential } from '../../auth/passkey-credential.entity';

@Entity('users') // table name
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

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

  @OneToOne(() => StudentProfile, (profile) => profile.user)
  studentProfile: StudentProfile;

  @OneToOne(() => EmployerProfile, (profile) => profile.user)
  employerProfile: EmployerProfile;

  @OneToMany(() => PasskeyCredential, (credential) => credential.user)
  passkeyCredentials: PasskeyCredential[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
