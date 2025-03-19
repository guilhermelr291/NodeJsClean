import { ObjectId } from 'mongodb';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols';
import MockDate from 'mockdate';
import { mockLoadSurveyByIdRepository } from '@/data/test/mock-db-survey';
import { mockSurvey } from '@/domain/test/mock-survey';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return { sut, loadSurveyByIdRepositoryStub };
};

const FAKE_ID = 123;

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    await sut.loadById(ObjectId.createFromTime(FAKE_ID));

    expect(loadByIdSpy).toHaveBeenCalledWith(ObjectId.createFromTime(FAKE_ID));
  });

  test('Should return a survey on success', async () => {
    const { sut } = makeSut();

    const survey = await sut.loadById(ObjectId.createFromTime(FAKE_ID));

    expect(survey).toEqual(mockSurvey());
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementation(() => {
        throw new Error();
      });

    expect(sut.loadById(ObjectId.createFromTime(FAKE_ID))).rejects.toThrow();
  });
});
