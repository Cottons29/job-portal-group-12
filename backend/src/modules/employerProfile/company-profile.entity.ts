import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';


@Entity('employer_profiles')
export class EmployerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.employerProfile, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  companyName: string;

  @Column()
  patentUrl: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'text' })
  companyDescription: string;

  @Column()
  industry: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  website?: string;

  @Column()
  logoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
