import { Decrypter } from '../protocols/cryptography/decrypter';
import { Encrypter } from '../protocols/cryptography/encrypter';
import { HashComparer } from '../protocols/cryptography/hash-comparer';
import { Hasher } from '../protocols/cryptography/hasher';

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new HasherStub(); //temos que passar no construtor do dbAddAccount
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt(value: string): string {
      return 'any_value';
    }
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt(id: string): string {
      return 'any_token';
    }
  }
  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};
