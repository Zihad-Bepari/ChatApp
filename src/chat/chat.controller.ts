import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageType } from 'generated/prisma/enums';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessageToDataBase(@Body() dto:CreateChatDto) {
    return this.chatService.createMessage(dto);
  }

  @Get('messages')
  async getMessagesByDatabase() {
  }
}
