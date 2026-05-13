import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../modules/user/user.entity';
import { PasskeyCredential } from './passkey-credential.entity';
import { PayloadEncryptionService } from './payload-encryption.service';
import { SessionEntity } from './session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasskeyCredential, SessionEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PayloadEncryptionService],
  exports: [AuthService],
})
export class AuthModule {}
