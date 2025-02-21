import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'));
  },
}));

const salt = 12; //botando aqui para nao precisar retornar no makeSut
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const sut = makeSut();
    await sut.hash('any_value'); //como estamos testando a integração aqui, não estamos preocupados com o retorno.
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
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
});
