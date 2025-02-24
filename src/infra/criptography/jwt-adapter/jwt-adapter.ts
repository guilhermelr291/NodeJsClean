import { Encrypter } from '../../../data/protocols/cryptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }
  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret);
    return token;
  }
}
