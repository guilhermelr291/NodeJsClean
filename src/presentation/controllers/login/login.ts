import { Authentication } from '../../../domain/usecases/authentication';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) return badRequest(new InvalidParamError('email'));

      const { email, password } = httpRequest.body;
      this.authentication.auth(email, password);

      return ok({});
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
