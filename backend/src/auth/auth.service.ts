import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  private idCounter = 1;

  async register(email: string, password: string): Promise<Omit<User, 'password'>> {
    const existing = this.users.find((u) => u.email === email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: this.idCounter++,
      email,
      password: hashedPassword,
    };
    this.users.push(user);

    const { password: _, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
