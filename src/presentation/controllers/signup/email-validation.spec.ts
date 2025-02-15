import { InvalidParamError, ServerError } from '../../errors';
import { serverError } from '../../helpers/http-helper';
import { EmailValidation } from '../../helpers/validators/email-validation';
import { EmailValidator } from '../../protocols/email-validator';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true; //IMPORTANT lembrar de sempre retornar algo que nao interrompa o fluxo da execução. Se precisarmos testar um caso negativo, que de erro, basta usarmos um mock e pronto.
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();

  const sut = new EmailValidation('email', emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe('Email Validation', () => {
  //geralmente, botamos na descrição o nome do componente que estamos testando.

  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'invalid_email@mail.com' });
    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct e-mail', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({ email: 'any_email@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
