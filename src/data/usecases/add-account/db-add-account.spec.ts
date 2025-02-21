import { DbAddAccount } from './db-add-account';
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
} from './db-add-account-protocols';

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new HasherStub(); //temos que passar no construtor do dbAddAccount
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
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return { sut, hasherStub: hasherStub, addAccountRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(makeFakeAccountData());
    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Hasher throws', async () => {
    //nao vamos tratar a exceção aqui, pois ja temos um try catch no nosso controller. vms apenas repassar a exceção.
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, 'hash')
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
