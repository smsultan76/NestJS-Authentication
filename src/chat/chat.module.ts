import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAIService } from './openai.service';
import { ContentChat } from './entities/content-chat.entity';
import { ContentMessage } from './entities/content-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentChat, ContentMessage]),
    HttpModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenAIService],
  exports: [ChatService],
})
export class ChatModule {}