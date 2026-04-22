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
@Check(`"yearOfStudy" BETWEEN 1 AND 4`)
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

  @Column()
  phone: string;

  @Column()
  university: string;

  @Column()
  major: string;

  @Column({ type: 'int' })
  yearOfStudy: number;

  @Column({ length: 255 })
  bio: string;

  @Column()
  cvUrl: string;

  @Column()
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
