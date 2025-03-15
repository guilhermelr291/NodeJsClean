import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';
import e from 'express';

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};
let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSurvey = async (): Promise<SurveyModel> => {
  const { insertedId } = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' },
      { answer: 'another_answer' },
    ],
    date: new Date(),
  });

  const survey = await surveyCollection.findOne({
    _id: new ObjectId(insertedId),
  });

  return MongoHelper.map(survey);
};

const makeAccount = async (): Promise<AccountModel> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  });

  const account = await accountCollection.findOne({
    _id: new ObjectId(insertedId),
  });

  return MongoHelper.map(account);
};
describe('Survey Mongo Repository', () => {
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('account');
    await surveyCollection.deleteMany({});
  });

  describe('save()', () => {
    test('Should add a survey result if it is new ', async () => {
      const survey = await makeSurvey();

      const account = await makeAccount();
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });
    test('Should update a survey result if it already exists ', async () => {
      const survey = await makeSurvey();

      const account = await makeAccount();
      const sut = makeSut();

      const res = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      expect(res.id).toBe(surveyResult.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[1].answer);
    });
  });
});
