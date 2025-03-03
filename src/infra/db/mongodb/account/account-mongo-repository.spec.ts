import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};
let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!);
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  //quando estamos mexendo com testes de integração e banco de dados,
  // é importante também, entre os testes, zerarmos as respectivas tabelas.
  //para evitar que fique lixo e influencie nos outros testes

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('add', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      });
      expect(account).toBeTruthy(); //garante que nao é nulo, undefined, etc..
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('loadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      });
      const account = await sut.loadByEmail('any_email@mail.com'); //lembrar que não adianta mockarmos aqui. Precisamos realmente criar um user no banco antes de fazer esse teste, já que é um teste de integração com o mongodb.
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    test('Should return null if loadByEmail returns null', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeNull();
    });
  });

  describe('updateAccessToken', () => {
    test('Should update account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      await sut.updateAccessToken(result.insertedId.toHexString(), 'any_token');

      const account = await accountCollection.findOne({
        _id: result.insertedId,
      });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });
});
