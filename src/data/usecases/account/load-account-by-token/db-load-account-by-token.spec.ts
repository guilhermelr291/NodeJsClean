import { mockAccountModel } from '@/domain/test';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols';
import { mockDecrypter } from '../../../test/index';
import { mockLoadAccountByTokenRepository } from '@/data/test/mock-db-account';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};
const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();

  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );

  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.loadByToken('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null);

    const account = await sut.loadByToken('any_token', 'any_role');

    expect(account).toBeNull();
  });
  test('Should call LoadAccountByToken repository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    );

    await sut.loadByToken('any_token', 'any_role');

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });
  test('Should return null if LoadAccountByToken repository return null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)));

    const account = await sut.loadByToken('any_token', 'any_role');

    expect(account).toBeNull();
  });
  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.loadByToken('any_token', 'any_role');

    expect(account).toEqual(mockAccountModel());
  });
  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.loadByToken('any_token', 'any_role')).rejects.toThrow();
  });
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(sut.loadByToken('any_token', 'any_role')).rejects.toThrow();
  });
});
