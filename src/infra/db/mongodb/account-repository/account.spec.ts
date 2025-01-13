import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  //quando estamos mexendo com testes de integração e banco de dados,
  // é importante também, entre os testes, zerarmos as respectivas tabelas.
  //para evitar que fique lixo e influencie nos outros testes

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should return an account on success', async () => {
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
