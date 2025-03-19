import {
  AddAccount,
  AddAccountParams,
} from '@/domain/usecases/account/add-account';
import { AccountModel } from '../middlewares/auth-middleware-protocols';
import { mockAccountModel } from '@/domain/test';
import {
  Authentication,
  AuthenticationParams,
} from '@/domain/usecases/account/authentication';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      //estamos usando o AccountModel somente no retorno pois nele temos também o id. Se usarmos no lugar do AddAccountParams, o campo id ficaria em branco e não é interessante. Fora isso, teríamos que ter o campo id como opcional, o que n é opcional no nosso retorno.

      return new Promise(resolve => resolve(mockAccountModel()));
    }
  }

  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};
