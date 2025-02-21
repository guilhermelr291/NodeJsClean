import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'));
  },
  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  },
}));

const salt = 12; //botando aqui para nao precisar retornar no makeSut
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('BcryptAdapter', () => {
  test('Should call hash with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const sut = makeSut();
    await sut.hash('any_value'); //como estamos testando a integração aqui, não estamos preocupados com o retorno.
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value'); //o certo aq é mockarmos o bcrypt. nao nos interessa saber como o bcrypt gera a hash. o que nos interessa é que o valor retornado pelo bcrypt seja igual ao retorno da função encrypt.
    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.reject(new Error());
    });

    const promise = sut.hash('any_value'); //lembrar que quando formos testar uma exceção não podemos usar o await. temos que capturar a promise e analisa-la.
    await expect(promise).rejects.toThrow();
  });

  test('Should call compare with correct values', async () => {
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    const sut = makeSut();
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });
  test('Should return false when compare returns false', async () => {
    const sut = makeSut();
    jest
      .spyOn<any, string>(bcrypt, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)));

    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(false);
  });
});
