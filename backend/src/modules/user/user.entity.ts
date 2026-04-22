import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { UserRole } from '../common/enums/user-role.enum';
import { AccountStatus } from '../common/enums/account-status.enum';
import { StudentProfile } from '../studentProfile/student-profile.entity';
import { EmployerProfile } from '../employerProfile/company-profile.entity';

@Entity('users') // table name
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @OneToOne(()=>StudentProfile,(profile)=>profile.user)
  studentProfile:StudentProfile;

  @OneToOne(()=>EmployerProfile,(profile)=>profile.user)
  employerProfile:EmployerProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}