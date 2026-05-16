import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { PostEntity } from './post.entity';

@Entity('post_comments')
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
