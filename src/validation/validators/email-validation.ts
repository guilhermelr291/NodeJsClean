import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';
import { EmailValidator } from './protocols/email-validator';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }
  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) return new InvalidParamError(this.fieldName);
  }
}
