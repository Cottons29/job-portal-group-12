import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // tighten this to your frontend origin in production
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  /**
   * In-memory mapping of userId → Set of connected socket IDs.
   * A single user may have multiple tabs/devices open simultaneously,
   * so we track a Set rather than a single socket ID.
   */
  private readonly userSocketMap = new Map<string, Set<string>>();

  // ─── Lifecycle hooks ────────────────────────────────────────────

  handleConnection(client: Socket): void {
    const userId = client.handshake.query.userId as string;

    if (!userId) {
      this.logger.warn(
        `Socket ${client.id} connected without a userId — disconnecting.`,
      );
      client.disconnect();
      return;
    }

    // Register the socket under its userId
    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, new Set());
    }
    this.userSocketMap.get(userId)!.add(client.id);

    this.logger.log(`✔ User ${userId} connected  [socket: ${client.id}]`);
  }

  handleDisconnect(client: Socket): void {
    const userId = client.handshake.query.userId as string;

    if (userId && this.userSocketMap.has(userId)) {
      const sockets = this.userSocketMap.get(userId)!;
      sockets.delete(client.id);

      // Clean up the entry entirely if no sockets remain
      if (sockets.size === 0) {
        this.userSocketMap.delete(userId);
      }
    }

    this.logger.log(`✖ Socket ${client.id} disconnected`);
  }

  // ─── Public API ─────────────────────────────────────────────────

  /**
   * Emit a `notification.created` event to every socket that belongs
   * to the given userId. If the user is offline the event is silently
   * dropped (they will see the notification on next fetch from the DB).
   */
  emitToUser(userId: string, payload: Record<string, any>): void {
    const socketIds = this.userSocketMap.get(userId);

    if (!socketIds || socketIds.size === 0) {
      this.logger.debug(
        `User ${userId} is offline — notification not pushed via WS.`,
      );
      return;
    }

    for (const socketId of socketIds) {
      this.server.to(socketId).emit('notification.created', payload);
    }

    this.logger.log(
      `📨 Emitted notification.created to user ${userId} (${socketIds.size} socket(s))`,
    );
  }
}
