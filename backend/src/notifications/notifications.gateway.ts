import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Simple in-memory map: userId -> socketId
  // In a multi-instance production environment, consider using Redis adapter
  private activeUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    // Usually you'd extract the user ID from the JWT token during connection handshakes
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.activeUsers.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    // Find and remove the disconnected user
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  emitNotification(userId: string, payload: any) {
    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification.created', payload);
      return true;
    }
    return false; // User not currently online
  }
}
