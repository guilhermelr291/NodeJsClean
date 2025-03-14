import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { Decrypter } from '../../protocols/cryptography/decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly LoadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {
    this.decrypter = decrypter;
    this.LoadAccountByTokenRepository = LoadAccountByTokenRepository;
  }
  async loadByToken(
    accessToken: string,
    role?: string
  ): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken);

    if (token) {
      const account = await this.LoadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      );
      if (account) return account;
    }

    return null;
  }
}
