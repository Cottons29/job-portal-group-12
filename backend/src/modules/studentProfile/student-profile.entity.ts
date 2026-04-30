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
@Check(`"yearOfStudy" IS NULL OR ("yearOfStudy" BETWEEN 1 AND 5)`)
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nullable for now: AuthService stores users in-memory and the FK target row
  // may not exist in the `users` table yet. We keep the relation so the User
  // entity's inverse OneToOne still resolves; once auth persists users to DB,
  // this can be made non-nullable again.
  @Column({ nullable: true })
  userId?: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User | null;

  // Tracks the (in-memory) session user that created this profile, so we can
  // upsert across requests without depending on a DB-persisted User row.
  // NOTE: we set `type: 'varchar'` explicitly because the TypeScript type
  // `string | null` is reflected as `Object`, which TypeORM can't map to a
  // Postgres column type (DataTypeNotSupportedError).
  @Column({ type: 'varchar', nullable: true })
  sessionUserId?: string | null;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  university: string;

  @Column()
  major: string;

  // Mapped from the UI's "Year 1..4 / Graduate" label.
  @Column({ type: 'int', nullable: true })
  yearOfStudy?: number | null;

  // Raw label kept for display fidelity (e.g. "Graduate").
  @Column({ nullable: true })
  yearLevel?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column('text', { array: true, default: () => "ARRAY[]::text[]" })
  skills: string[];

  @Column({ nullable: true })
  jobType?: string;

  @Column({ type: 'jsonb', nullable: true })
  availability?: Record<string, Record<string, boolean>> | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  expectedSalary?: string | null;

  @Column({ length: 3, nullable: true })
  currency?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
