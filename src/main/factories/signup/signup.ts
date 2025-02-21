import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { SignUpController } from '../../../presentation/controllers/signup/signup';

import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log';
import { makeSignUpValidation } from './signup-validation';

//agora, em vez de retornamos um signUpController, podemos retornar um LogControllerDecorator, pois eles tem a mesma implementação. Ambos implementam Controller
//agora, basta invocarmos o handle do controller recebido no LogControllerDecorator.
//outro principio do solid, que é o do liskov: podemos utilizar uma classe no lugar da outra contanto que ela implemente a mesma interface.
// vamos mudar a assinatura de retorno de SignUpController para Controller. Precisamos ser mais genéricos agora.
// o decorator nos permite adicionar um comportamento a um objeto sem modificar o objeto.
export const makeSignUpController = (): Controller => {
  const salt = 12;

  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  //return new SignUpController(emailValidatorAdapter, dbAddAccount);
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
  //estamos respeitando o single principle do solid, por isso tantos
  //  componentes para montar o controller
};
