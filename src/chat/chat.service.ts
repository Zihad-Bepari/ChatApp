import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { MessageType } from 'generated/prisma/enums';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  
 async createMessage(dto: CreateChatDto) {
  return this.prisma.client.message.create({
    data: {
      text: dto.text || null,
      imageUrl: dto.imageUrl || null,
      audioUrl: dto.audioUrl || null,
      user: dto.user,
      type: dto.type as MessageType,
    },
  });
}

  async getMessagesByDatabase() {
    return this.prisma.client.message.findMany({
        orderBy: { createdAt: 'asc' },
  });
 }
}
