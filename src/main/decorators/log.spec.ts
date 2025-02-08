import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

//como o LogControllerDecorator pode receber qualquer controller, vms criar um controller mockado aqui. um Stub

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

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

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
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
});
