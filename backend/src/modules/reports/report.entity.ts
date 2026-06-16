import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column()
  reporterId: string;

  @Column({ type: 'varchar' })
  targetType: 'post' | 'user';

  @ManyToOne(() => PostEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetPostId' })
  targetPost?: PostEntity;

  @Column({ nullable: true })
  targetPostId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetUserId' })
  targetUser?: User;

  @Column({ nullable: true })
  targetUserId?: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: 'pending' | 'resolved' | 'dismissed';

  @CreateDateColumn()
  createdAt: Date;
}
