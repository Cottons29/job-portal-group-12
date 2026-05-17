import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      receiverId,
      content,
    });
    return this.messageRepository.save(message);
  }

  async getChatHistory(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async getContacts(userId: string): Promise<any[]> {
    // Find all messages involving this user
    const messages = await this.messageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId },
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    // Extract unique contact IDs
    const contactIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) contactIds.add(msg.senderId);
      if (msg.receiverId !== userId) contactIds.add(msg.receiverId);
    });

    if (contactIds.size === 0) return [];

    // Fetch details for all contacts
    const contacts = await this.userRepository.find({
      where: Array.from(contactIds).map((id) => ({ id })),
    });

    // Map contacts to clean public formats
    return contacts.map((user) => {
      const isEmployer = user.role === UserRole.EMPLOYER;
      const name = isEmployer 
        ? user.companyName || user.user_name || 'Company'
        : user.fullName || user.user_name || 'Student';
      const avatar = isEmployer
        ? user.logoUrl
        : user.profileImageUrl;

      // Find the last message with this user
      const lastMsg = messages.find(
        (m) => (m.senderId === user.id && m.receiverId === userId) || 
               (m.senderId === userId && m.receiverId === user.id)
      );

      return {
        id: user.id,
        name,
        avatar,
        role: user.role,
        lastMessage: lastMsg?.content || '',
        lastMessageAt: lastMsg?.createdAt || new Date(),
      };
    });
  }
}
