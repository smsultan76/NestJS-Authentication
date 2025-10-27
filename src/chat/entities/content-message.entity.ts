import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContentChat } from './content-chat.entity';

@Entity('content_messages')
export class ContentMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  chat_id: string;

  @Column()
  role: string; // 'user' or 'assistant'

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  openai_response: any;

  @Column({ default: 'success' })
  status: string; // 'success' or 'failed'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => ContentChat, chat => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: ContentChat;
}