import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = {
      id: result.insertedId.toHexString(),
      ...accountData,
    };
    return account; //conforme dito anteriormente,nao vamos reconectar o MongoHelper no bd. vamos criar um método para aproveitar a conexão já ativa e pegar apenas a collection que queremos testar.
  }
}
