import { MissingParamError, ServerError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }

      return ok({});
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
