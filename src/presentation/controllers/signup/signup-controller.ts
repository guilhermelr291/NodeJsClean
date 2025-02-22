import {
  HttpResponse,
  HttpRequest,
  Controller,
  Validation,
} from './signup-controller-protocols';
import { InvalidParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http/http-helper';
import { AddAccount } from '../../../domain/usecases/add-account';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
