import { BadRequestException, Injectable } from '@nestjs/common';
import {
  constants,
  createPrivateKey,
  generateKeyPairSync,
  privateDecrypt,
} from 'crypto';
import type { EncryptedPayloadDto } from './encrypted-payload.dto';

@Injectable()
export class PayloadEncryptionService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor() {
    const configuredPrivateKey =
      process.env.PAYLOAD_ENCRYPTION_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const configuredPublicKey =
      process.env.PAYLOAD_ENCRYPTION_PUBLIC_KEY?.replace(/\\n/g, '\n');

    if (configuredPrivateKey && configuredPublicKey) {
      this.privateKey = configuredPrivateKey;
      this.publicKey = configuredPublicKey;
      return;
    }

    const keyPair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  getPublicKey() {
    return this.publicKey;
  }

  async decrypt<T>(payload: EncryptedPayloadDto): Promise<T> {
    if (!payload?.encryptedKey || !payload?.iv || !payload?.ciphertext) {
      throw new BadRequestException('Encrypted payload is required');
    }

    try {
      const encryptedKey = Buffer.from(payload.encryptedKey, 'base64');
      const iv = Buffer.from(payload.iv, 'base64');
      const encryptedPayload = Buffer.from(payload.ciphertext, 'base64');
      const authTag = encryptedPayload.subarray(encryptedPayload.length - 16);
      const ciphertext = encryptedPayload.subarray(
        0,
        encryptedPayload.length - 16,
      );

      const aesKey = privateDecrypt(
        {
          key: createPrivateKey(this.privateKey),
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        encryptedKey,
      );

      const { createDecipheriv } = await import('crypto');
      const decipher = createDecipheriv('aes-256-gcm', aesKey, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]).toString('utf8');

      return JSON.parse(decrypted) as T;
    } catch (error) {
      throw new BadRequestException('Invalid encrypted payload');
    }
  }
}
