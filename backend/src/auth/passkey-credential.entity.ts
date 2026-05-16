import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../modules/user/user.entity';

@Entity('passkey_credentials')
export class PasskeyCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  credentialId: string;

  @Column({ type: 'text' })
  publicKey: string;

  @Column({ default: 0 })
  counter: number;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  transports: string[];

  @Column({ nullable: true })
  deviceType: string;

  @Column({ default: false })
  backedUp: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
