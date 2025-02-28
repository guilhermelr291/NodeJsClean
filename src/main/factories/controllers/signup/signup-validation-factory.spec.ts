import { Validation } from '../../../../presentation/protocols/validation';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { EmailValidator } from '../../../../validation/validators/protocols/email-validator';

import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');
//ta mockado. em qualquer lugar q for chamado teremos acesso.

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true; //IMPORTANT lembrar de sempre retornar algo que nao interrompa o fluxo da execução. Se precisarmos testar um caso negativo, que de erro, basta usarmos um mock e pronto.
    }
  }
  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
