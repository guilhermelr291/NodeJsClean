import { Decrypter } from '../../../data/protocols/cryptography/decrypter';
import { Encrypter } from '../../../data/protocols/cryptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }
  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret);
    return token;
  }

  async decrypt(value: string): Promise<string | null> {
    jwt.verify(value, this.secret);
    return null;
  }
}
