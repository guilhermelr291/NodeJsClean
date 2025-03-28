import { Validation } from '@/presentation/protocols/validation';
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { EmailValidator } from '@/validation/validators/protocols/email-validator';

import { makeLoginValidation } from './login-validation-factory';

jest.mock('@/validation/validators/validation-composite');
//ta mockado. em qualquer lugar q for chamado teremos acesso.

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true; //IMPORTANT lembrar de sempre retornar algo que nao interrompa o fluxo da execução. Se precisarmos testar um caso negativo, que de erro, basta usarmos um mock e pronto.
    }
  }
  return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
