import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';

import { mockAccountModel } from '@/domain/test';
import { mockLogErrorRepository } from '@/data/test';

//como o LogControllerDecorator pode receber qualquer controller, vms criar um controller mockado aqui. um Stub

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(mockAccountModel())));
    }
  }

  return new ControllerStub();
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  const error = serverError(fakeError);

  return error;
};
type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  LogErrorRepositoryStub: LogErrorRepository;
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const LogErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    LogErrorRepositoryStub
  );

  return { sut, controllerStub, LogErrorRepositoryStub };
};

describe('LogControllerDecorator', () => {
  //IMPORTANT garantir que o decorator vai chamar o handle do controller com o valor certo.
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a serverError', async () => {
    const { sut, controllerStub, LogErrorRepositoryStub } = makeSut();

    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(makeFakeServerError()))
      ); //como é assíncrono, temos que mockar com Promise. Cometi o erro de retornar uma promise com reject. Nao posso fazer isso, pois assim ele vai lançar uma exceção e quebrar o teste. O que ele retorna no catch n é considerado exceção, mas sim um retorno.

    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
