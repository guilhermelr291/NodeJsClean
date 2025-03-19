import { AccountModel } from '@/domain/models/account';
import { AddAccountRepository } from '../protocols/db/account/add-account-repository';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { mockAccountModel } from '@/domain/test';
import { LoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository';
import { LoadAccountByToken } from '@/presentation/middlewares/auth-middleware-protocols';
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository';
import { AuthenticationParams } from '@/domain/usecases/account/authentication';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class addAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return new Promise(resolve => resolve(mockAccountModel()));
    }
  }

  return new addAccountRepositoryStub(); //temos que passar no construtor do dbAddAccount
};

export const mockLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return mockAccountModel();
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken(
      accessToken: string,
      role?: string
    ): Promise<AccountModel> {
      return new Promise(resolve => resolve(mockAccountModel()));
    }
  }

  return new LoadAccountByTokenStub();
};

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(
        token: string,
        role?: string
      ): Promise<AccountModel | null> {
        return new Promise(resolve => resolve(mockAccountModel()));
      }
    }
    return new LoadAccountByTokenRepositoryStub();
  };

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(id: string, token: string): Promise<void> {
        return new Promise(resolve => resolve());
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});
