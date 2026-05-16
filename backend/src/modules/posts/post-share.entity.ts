import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { PostEntity } from './post.entity';

@Entity('post_shares')
export class PostShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PostEntity, (post) => post.shares, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @CreateDateColumn()
  createdAt: Date;
}
