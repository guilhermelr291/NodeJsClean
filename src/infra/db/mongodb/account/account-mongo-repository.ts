import { ObjectId } from 'mongodb';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByToken
{
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

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });

    if (!account) {
      return null;
    }

    return MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }

  async loadByToken(
    token: string,
    role?: string
  ): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        { role },
        {
          role: 'admin',
        },
      ],
    });

    if (!account) {
      return null;
    }

    return MongoHelper.map(account);
  }
}
