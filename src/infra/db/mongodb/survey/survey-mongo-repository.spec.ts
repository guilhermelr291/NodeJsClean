describe('', () => {});
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};
let surveyCollection: Collection;

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
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
          {
            answer: 'another_answer',
          },
        ],
        date: new Date(),
      });

      const survey = await surveyCollection.findOne({
        question: 'any_question',
      });

      expect(survey).toBeTruthy();
    });
  });
});
