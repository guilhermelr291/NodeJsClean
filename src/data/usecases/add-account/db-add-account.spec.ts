import { DbAddAccount } from './db-add-account';
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from './db-add-account-protocols';

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new EncrypterStub(); //temos que passar no construtor do dbAddAccount
};
const makeAddAccountRepository = (): AddAccountRepository => {
  class addAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }

  return new addAccountRepositoryStub(); //temos que passar no construtor do dbAddAccount
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { sut, encrypterStub, addAccountRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      //IMPORTANT lembrar que ja recebemos esses dados validados do nosso controller.
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', async () => {
    //nao vamos tratar a exceção aqui, pois ja temos um try catch no nosso controller. vms apenas repassar a exceção.
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      //IMPORTANT lembrar que ja recebemos esses dados validados do nosso controller.
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promise = sut.add(accountData); //temos que obter o retorno sem o await, pegarmos a promise e, a partir dela, esperarmos o reject.
    await expect(promise).rejects.toThrow(); //por que "perder tempo" criando um teste desse? Simplesmente, para caso alguém coloque um try catch no método, n corrermos o risco da exceção não ser lançada e não tratada pelo controller.
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      //IMPORTANT lembrar que ja recebemos esses dados validados do nosso controller.
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });
});
