import { Decrypter } from '@/data/protocols/cryptography/decrypter';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }
  encrypt(value: string): string {
    const token = jwt.sign({ id: value }, this.secret);
    return token;
  }

  decrypt(token: string): string | null {
    const value: any = jwt.verify(token, this.secret);
    return value;
  }
}
