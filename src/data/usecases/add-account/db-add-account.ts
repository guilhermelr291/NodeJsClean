import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password); //IMPORTANT vale lembrar que o accountData que recebemos no parametro nao ta com a senha criptografada. se passarmos para o repositorio, vai dar erro.
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    );

    return new Promise(resolve => resolve(account));
  }
}
