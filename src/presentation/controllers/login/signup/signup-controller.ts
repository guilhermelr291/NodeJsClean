import {
  HttpResponse,
  HttpRequest,
  Controller,
  Validation,
  Authentication,
} from './signup-controller-protocols';

import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '../../../helpers/http/http-helper';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { EmailInUseError } from '@/presentation/errors';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {
    this.addAccount = addAccount;
    this.validation = validation;
    this.authentication = authentication;
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

      if (!account) return forbidden(new EmailInUseError());

      const accessToken = await this.authentication.auth({ email, password });

      return ok({ accessToken });
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
