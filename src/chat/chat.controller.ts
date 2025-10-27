import { Controller, Post, Get, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewChatDto } from './dto/new-chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard) // All routes in this controller require authentication
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('new')
  async newChat(@Request() req, @Body() newChatDto: NewChatDto) {
    return this.chatService.newChat(req.user.id, newChatDto);
  }

  @Post('create')
  async createChat(@Request() req, @Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(req.user.id, createChatDto);
  }

  @Get('my-chats')
  async getUserChats(@Request() req) {
    return this.chatService.getUserChats(req.user.id);
  }

  @Get(':chatId')
  async getChatById(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.getChatById(req.user.id, chatId);
  }

  @Get(':chatId/messages')
  async getChatMessages(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.getChatMessages(req.user.id, chatId);
  }

  @Delete(':chatId')
  async deleteChat(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.deleteChat(req.user.id, chatId);
  }

  @Patch(':chatId/title')
  async updateChatTitle(
    @Request() req,
    @Param('chatId') chatId: string,
    @Body('title') title: string,
  ) {
    return this.chatService.updateChatTitle(req.user.id, chatId, title);
  }
}