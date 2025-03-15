import {
  AccountModel,
  Decrypter,
  LoadAccountByToken,
  LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols';

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
