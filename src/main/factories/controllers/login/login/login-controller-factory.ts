import { Controller } from '@/presentation/protocols';
import { LoginController } from '@/presentation/controllers/login/login/login-controller';

import { makeLoginValidation } from './login-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );

  return makeLogControllerDecorator(loginController);
};
