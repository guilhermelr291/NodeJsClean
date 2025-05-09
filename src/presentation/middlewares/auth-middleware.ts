import { AccessDeniedError } from '../errors';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import {
  Middleware,
  HttpRequest,
  HttpResponse,
  LoadAccountByToken,
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {
    this.loadAccountByToken = loadAccountByToken;
    this.role = role;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];

      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(
          accessToken,
          this.role
        );

        if (account) return ok({ accountId: account.id });
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
