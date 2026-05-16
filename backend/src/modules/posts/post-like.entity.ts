import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { PostEntity } from './post.entity';

@Entity('post_likes')
@Unique(['user', 'post'])
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PostEntity, (post) => post.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @CreateDateColumn()
  createdAt: Date;
}
