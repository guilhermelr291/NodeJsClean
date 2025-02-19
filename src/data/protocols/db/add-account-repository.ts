import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account'; //vamos importar diretamente do domain e não do nosso arquivo do add-account, pois essa é uma implementacao voltada para o banco de dados e faz mais sentido pegar do domain, ja que sao regras de negocio.

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
