import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly defaultSaltRounds = 10;

  async hash(plainText: string, saltRounds = this.defaultSaltRounds): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
