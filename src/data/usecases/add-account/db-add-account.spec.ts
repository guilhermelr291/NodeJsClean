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
      return new Promise(resolve => resolve(makeFakeAccount()));
    }
  }

  return new addAccountRepositoryStub(); //temos que passar no construtor do dbAddAccount
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

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

    await sut.add(makeFakeAccountData());
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

    const promise = sut.add(makeFakeAccountData()); //temos que obter o retorno sem o await, pegarmos a promise e, a partir dela, esperarmos o reject.
    await expect(promise).rejects.toThrow(); //por que "perder tempo" criando um teste desse? Simplesmente, para caso alguém coloque um try catch no método, n corrermos o risco da exceção não ser lançada e não tratada pelo controller.
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    //IMPORTANT lembrar que ja recebemos esses dados validados do nosso controller. (makeFakeAccountData())

    await sut.add(makeFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    //nao vamos tratar a exceção aqui, pois ja temos um try catch no nosso controller. vms apenas repassar a exceção.
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeFakeAccountData()); //temos que obter o retorno sem o await, pegarmos a promise e, a partir dela, esperarmos o reject.
    await expect(promise).rejects.toThrow(); //por que "perder tempo" criando um teste desse? Simplesmente, para caso alguém coloque um try catch no método, n corrermos o risco da exceção não ser lançada e não tratada pelo controller.
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    //IMPORTANT Lembrete: caso de sucesso a gente não mocka! o default dos testes deve ser passar. mocks apenas para retornar erros ou valores que causem erros.

    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
