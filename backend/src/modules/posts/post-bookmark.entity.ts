import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../user/user.entity';
import { PostEntity } from './post.entity';

@Entity('post_bookmarks')
@Unique(['user', 'post'])
export class PostBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PostEntity, (post) => post.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @CreateDateColumn()
  createdAt: Date;
}
