import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  phone: string;

  @Column()
  university: string;

  @Column()
  major: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  yearLevel: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  jobType: string;

  @Column({ type: 'jsonb', nullable: true })
  availability: any;

  @Column({ nullable: true })
  expectedSalary: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  cvUrl: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
