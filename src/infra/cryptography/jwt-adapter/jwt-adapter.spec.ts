import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'token';
  },
  verify(): any {
    return { id: 'any_value' };
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      sut.encrypt('any_id');

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });
    test('Should return a token on sign success', async () => {
      const sut = makeSut();

      const accessToken = await sut.encrypt('any_id');

      expect(accessToken).toBe('token');
    });

    test('Should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => sut.encrypt('any_id')).toThrow();
    });
  });

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut();

      const verifySpy = jest.spyOn(jwt, 'verify');
      sut.decrypt('any_token');

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    test('Should return a value on verify success', async () => {
      const sut = makeSut();

      const value = sut.decrypt('any_token');

      expect(value).toEqual({ id: 'any_value' });
    });

    test('Should throw if verify throws', () => {
      const sut = makeSut();

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => sut.decrypt('any_token')).toThrow();
    });
  });
});
