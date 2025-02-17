import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};

describe('RequiredFieldValidation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({ anotherField: 'anotherField' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
