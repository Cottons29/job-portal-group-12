import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @Column({ type: 'text', nullable: true })
  text: string | null;

  @Column({ nullable: true })
  mediaUrl: string | null;

  @Column({ default: 'text' })
  type: 'text' | 'photo';

  @Column({ nullable: true })
  bgColor: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;
}
