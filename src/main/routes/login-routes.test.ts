import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

let accountCollection: Collection;
describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Guilherme',
          email: 'guilhermelr@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Guilherme',
        email: 'guilhermelr@gmail.com',
        password,
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilhermelr@gmail.com',
          password: '123',
        })
        .expect(200);
    });
    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilhermelr@gmail.com',
          password: '123',
        })
        .expect(401);
    });
  });
});
