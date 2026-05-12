export interface EncryptedPayloadDto {
  encryptedKey: string;
  iv: string;
  ciphertext: string;
}
