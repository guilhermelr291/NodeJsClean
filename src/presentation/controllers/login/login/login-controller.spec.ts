import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http/http-helper';

import { LoginController } from './login-controller';
import {
  Authentication,
  HttpRequest,
  Validation,
} from './login-controller-protocols';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { mockValidation } from '@/validation/test/mock-validation';
import { mockAuthentication } from '@/presentation/test';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};
const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, validationStub, authenticationStub };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 is Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError('')));
  });

  test('Should return 401 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(makeFakeRequest());
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
