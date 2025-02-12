import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { HttpRequest } from '../../protocols';
import { LoginController } from './login';

const makeSut = (): LoginController => {
  const loginController = new LoginController();
  return loginController;
};

describe('Login Controller', () => {
  test('Should return 400 if no e-mail is provided', async () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: '',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
});
