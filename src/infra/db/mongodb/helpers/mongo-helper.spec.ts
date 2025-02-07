import { MongoHelper as sut } from './mongo-helper'; //IMPORTANT lembrar que nao é uma classe. Isso é um objeto direto.

describe('Mongo Helper', () => {
  beforeAll(async () => {
    console.log('mongo url: ', process.env.MONGO_URL);
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
