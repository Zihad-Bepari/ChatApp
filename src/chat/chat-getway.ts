import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageType } from 'generated/prisma/enums';

@WebSocketGateway(3002, {
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  // ============================
  // 🔵 USER CONNECTED
  // ============================
  handleConnection(client: Socket) {
    const username = client.handshake.query.username || 'Unknown User';

    console.log('---------------------------------------->');
    console.log('🔌 Socket Connected');
    console.log(`👤 Username: ${username}`);
    console.log(`🆔 Client ID: ${client.id}`);
    console.log(`🌐 Total Clients: ${this.server.sockets.sockets.size}`);
    console.log('---------------------------------------->');

    this.server.emit('User-Joined', {
      message: `${username} joined the chat`,
    });
  }

  // ============================
  // 🔴 USER DISCONNECTED
  // ============================
  handleDisconnect(client: Socket) {
    const username = client.handshake.query.username || 'Unknown User';

    console.log('---------------------------------------->');
    console.log('❌ Socket Disconnected');
    console.log(`👤 Username: ${username}`);
    console.log(`🆔 Client ID: ${client.id}`);
    console.log('---------------------------------------->');

    this.server.emit('User-left', {
      message: `${username} left the chat`,
    });
  }

  // ============================
  // ✉ TEXT MESSAGE
  // ============================
  @SubscribeMessage('NewMessage')
  async handleNewMessage(
    @MessageBody() data: { username: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    //console.log(`💬 New text message from ${data.username}: ${data.text}`);

    await this.chatService.createMessage({
      text: data.text,
      imageUrl: null,
      audioUrl: null,
      user: data.username,
      type: MessageType.TEXT,
    });

    this.server.emit('Message', {
      type: 'text',
      username: data.username,
      text: data.text,
    });
  }

  // ============================
  // 🖼 IMAGE MESSAGE
  // ============================
  @SubscribeMessage('NewImage')
  async handleNewImage(
    @MessageBody() data: { username: string; imageUrl: string },
    @ConnectedSocket() client: Socket,
  ) {
   // console.log(`🖼 Image sent by ${data.username}: ${data.imageUrl}`);

    await this.chatService.createMessage({
      text: null,
      imageUrl: data.imageUrl,
      audioUrl: null,
      user: data.username,
      type: MessageType.IMAGE,
    });

    this.server.emit('Message', {
      type: 'image',
      username: data.username,
      imageUrl: data.imageUrl,
    });
  }

  // ============================
  // 🎤 VOICE MESSAGE
  // ============================
  @SubscribeMessage('NewVoice')
  async handleNewVoice(
    @MessageBody() data: { username: string; audio: string },
    @ConnectedSocket() client: Socket,
  ) {
   // console.log(`🎤 Voice received from ${data.username}`);

    await this.chatService.createMessage({
      text: null,
      imageUrl: null,
      audioUrl: data.audio,
      user: data.username,
      type: MessageType.VOICE,
    });

    this.server.emit('Message', {
      type: 'voice',
      username: data.username,
      audio: data.audio,
    });
  }
}
