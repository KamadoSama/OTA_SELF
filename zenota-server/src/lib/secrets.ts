import * as crypto from 'crypto';

export function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

export function generatePassword(length: number = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export interface GeneratedSecrets {
  dbPassword: string;
  minioPassword: string;
  jwtSecret: string;
  authSecret: string;
}

export function generateAllSecrets(): GeneratedSecrets {
  return {
    dbPassword: generatePassword(32),
    minioPassword: generatePassword(32),
    jwtSecret: generateSecret(48),
    authSecret: generateSecret(32),
  };
}
