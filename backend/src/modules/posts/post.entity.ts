import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { PostBookmark } from './post-bookmark.entity';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostShare } from './post-share.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.post)
  comments: PostComment[];

  @OneToMany(() => PostShare, (share) => share.post)
  shares: PostShare[];

  @OneToMany(() => PostBookmark, (bookmark) => bookmark.post)
  bookmarks: PostBookmark[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
