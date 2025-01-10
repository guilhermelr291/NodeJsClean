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
    await sut.encrypt('any_value'); //como estamos testando a integração aqui, não estamos preocupados com o retorno.
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
  test('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt('any_value'); //o certo aq é mockarmos o bcrypt. nao nos interessa saber como o bcrypt gera a hash. o que nos interessa é que o valor retornado pelo bcrypt seja igual ao retorno da função encrypt.
    expect(hash).toBe('hash');
  });
});
