import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContentMessage } from './content-message.entity';

@Entity('content_chats')
export class ContentChat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  system_prompt: string;

  @Column({ default: 'gpt-4o-mini' })
  model: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ContentMessage, message => message.chat)
  messages: ContentMessage[];
}