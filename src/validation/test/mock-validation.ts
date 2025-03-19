import { Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null; //se n retornarmos erro nenhum, é sucesso. podemos usar NULL então.
    }
  }
  return new ValidationStub();
};
