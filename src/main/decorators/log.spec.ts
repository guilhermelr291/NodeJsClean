import { resolve } from 'path';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';
import { ServerError } from '../../presentation/errors';
import { serverError } from '../../presentation/helpers/http-helper';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';

//como o LogControllerDecorator pode receber qualquer controller, vms criar um controller mockado aqui. um Stub

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    log(stack: string): Promise<void> {
      //Promise<void> pq n retorna nd, mas, como lida com o bd, é async.

      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Rodrigo',
        },
      };
      return new Promise(resolve => resolve(httpResponse));
    }
  }

  return new ControllerStub();
};
interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  LogErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const LogErrorRepositoryStub = makeLogErrorRepository();
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
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name@name.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the same result of controller', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name@name.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Rodrigo',
      },
    });
  });

  test('Should call LogErrorRepository with correct error if controller returns a serverError', async () => {
    const { sut, controllerStub, LogErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error))); //como é assíncrono, temos que mockar com Promise. Cometi o erro de retornar uma promise com reject. Nao posso fazer isso, pois assim ele vai lançar uma exceção e quebrar o teste. O que ele retorna no catch n é considerado exceção, mas sim um retorno.
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name@name.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
