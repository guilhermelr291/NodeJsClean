import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors';
import { SignUpController } from './signup';
import { EmailValidator, HttpRequest } from './signup-protocols';
import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true; //IMPORTANT lembrar de sempre retornar algo que nao interrompa o fluxo da execução. Se precisarmos testar um caso negativo, que de erro, basta usarmos um mock e pronto.
    }
  }
  return new EmailValidatorStub();
};
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      //estamos usando o AccountModel somente no retorno pois nele temos também o id. Se usarmos no lugar do AddAccountModel, o campo id ficaria em branco e não é interessante. Fora isso, teríamos que ter o campo id como opcional, o que n é opcional no nosso retorno.

      return new Promise(resolve => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return { sut, emailValidatorStub, addAccountStub };
};

describe('SignUp Controller', () => {
  //geralmente, botamos na descrição o nome do componente que estamos testando.
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut(); //IMPORTANT começamos sempre com a instancia da classe que estamos testando. costumamos chamar esse instancia de 'sut'(system under test).
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest); //a funcao do controlador e controla a requisicão, validar o request e retornar um response valido.
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name'))); //IMPORTANT: parte da refatoração. codigo antigo comentado abaixo
    //expect(httpResponse.statusCode).toBe(400);
    //expect(httpResponse.body).toEqual(new MissingParamError('name'));
    //IMPORTANT toBe não pode ser usado para comparar 2 objetos, pois ele compara o ponteiro do objeto.
  }); //podemos começar, primeiramente, testando as validações.

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    // expect(httpResponse.statusCode).toBe(400);
    // expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'anyemail@mail.com',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
    // expect(httpResponse.statusCode).toBe(400);
    // expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'anyemail@mail.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    );
    // expect(httpResponse.statusCode).toBe(400);
    // expect(httpResponse.body).toEqual(
    //   new MissingParamError('passwordConfirmation')
    // );
  });

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'anyemail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    );
    // expect(httpResponse.statusCode).toBe(400);
    // expect(httpResponse.body).toEqual(
    //   new InvalidParamError('passwordConfirmation')
    // );
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    // expect(httpResponse.statusCode).toBe(400);
    // expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct e-mail', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
    // expect(httpResponse.statusCode).toBe(500);
    // expect(httpResponse.body).toEqual(new ServerError(null));
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
