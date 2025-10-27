import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentChat } from './entities/content-chat.entity';
import { ContentMessage } from './entities/content-message.entity';
import { OpenAIService } from './openai.service';
import { NewChatDto } from './dto/new-chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ContentChat)
    private chatRepository: Repository<ContentChat>,
    @InjectRepository(ContentMessage)
    private messageRepository: Repository<ContentMessage>,
    private openAIService: OpenAIService,
  ) {}

  async newChat(userId: string, newChatDto: NewChatDto) {
    let chat: ContentChat;

    // If chat_id is not provided, create a new chat
    if (!newChatDto.chat_id) {
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      chat = this.chatRepository.create({
        user_id: userId,
        title: `New Chat - ${currentDate}`,
        system_prompt: undefined,  // Changed from null to undefined
        model: 'gpt-4o-mini',
      });
      chat = await this.chatRepository.save(chat);
    } else {
      // Find existing chat
      const foundChat = await this.chatRepository.findOne({
        where: { id: newChatDto.chat_id },
      });

      if (!foundChat) {
        throw new NotFoundException('Chat not found');
      }

      // Check if user owns this chat
      if (foundChat.user_id !== userId) {
        throw new ForbiddenException('You do not have access to this chat');
      }

      chat = foundChat;
    }

    // Save user message first
    const userMessage = this.messageRepository.create({
      chat_id: chat.id,
      role: 'user',
      content: newChatDto.content,
      status: 'success',
    });
    await this.messageRepository.save(userMessage);

    // Get OpenAI response
    let assistantMessage: ContentMessage;
    try {
      const openAIResponse = await this.openAIService.sendMessage(
        newChatDto.content,
        chat.model,
      );

      const assistantContent = openAIResponse?.choices?.[0]?.message?.content;

      if (assistantContent) {
        assistantMessage = this.messageRepository.create({
          chat_id: chat.id,
          role: 'assistant',
          content: assistantContent,
          openai_response: openAIResponse,
          status: 'success',
        });
      } else {
        assistantMessage = this.messageRepository.create({
          chat_id: chat.id,
          role: 'assistant',
          content: 'No response from AI',
          status: 'failed',
        });
      }
    } catch (error) {
      assistantMessage = this.messageRepository.create({
        chat_id: chat.id,
        role: 'assistant',
        content: 'Failed to get AI response',
        status: 'failed',
      });
    }

    await this.messageRepository.save(assistantMessage);

    return {
      message: 'ChatGPT integration successful',
      data: {
        chat_id: chat.id,
        user_message: userMessage,
        assistant_message: assistantMessage,
      },
    };
  }

  async createChat(userId: string, createChatDto: CreateChatDto) {
    const chat = this.chatRepository.create({
      user_id: userId,
      title: createChatDto.title,
      system_prompt: createChatDto.system_prompt,
      model: createChatDto.model || 'gpt-4o-mini',
    });

    return await this.chatRepository.save(chat);
  }

  async getUserChats(userId: string) {
    return await this.chatRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async getChatById(userId: string, chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['messages'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return chat;
  }

  async getChatMessages(userId: string, chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return await this.messageRepository.find({
      where: { chat_id: chatId },
      order: { created_at: 'ASC' },
    });
  }

  async deleteChat(userId: string, chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    await this.chatRepository.remove(chat);

    return {
      message: 'Chat deleted successfully',
    };
  }

  async updateChatTitle(userId: string, chatId: string, title: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    chat.title = title;
    return await this.chatRepository.save(chat);
  }
}