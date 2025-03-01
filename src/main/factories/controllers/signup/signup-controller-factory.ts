import { SignUpController } from '../../../../presentation/controllers/login/signup/signup-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

//agora, em vez de retornamos um signUpController, podemos retornar um LogControllerDecorator, pois eles tem a mesma implementação. Ambos implementam Controller
//agora, basta invocarmos o handle do controller recebido no LogControllerDecorator.
//outro principio do solid, que é o do liskov: podemos utilizar uma classe no lugar da outra contanto que ela implemente a mesma interface.
// vamos mudar a assinatura de retorno de SignUpController para Controller. Precisamos ser mais genéricos agora.
// o decorator nos permite adicionar um comportamento a um objeto sem modificar o objeto.
export const makeSignUpController = (): Controller => {
  //return new SignUpController(emailValidatorAdapter, dbAddAccount);
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );

  return makeLogControllerDecorator(signUpController);
  //estamos respeitando o single principle do solid, por isso tantos
  //  componentes para montar o controller
};
