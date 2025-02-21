import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'token';
  },
}));

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign');
    sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret');

    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('token');
  });

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret');
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.encrypt('any_id')).rejects.toThrow();
  });
});
