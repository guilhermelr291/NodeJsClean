import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData); //um _id é inserido aqui, antes da inserção.
    delete accountData._id;

    const account = {
      id: result.insertedId.toHexString(),
      ...accountData,
    };

    return account; //conforme dito anteriormente,nao vamos reconectar o MongoHelper no bd. vamos criar um método para aproveitar a conexão já ativa e pegar apenas a collection que queremos testar.
  }
}
