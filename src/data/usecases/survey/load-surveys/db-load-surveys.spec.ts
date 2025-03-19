import {
  SurveyModel,
  LoadSurveysRepository,
} from './db-load-surveys-protocols';
import MockDate from 'mockdate';

import { DbLoadSurveys } from './db-load-surveys';
import { mockLoadSurveysRepository } from '@/data/test/mock-db-survey';
import { mockSurveysModel } from '@/domain/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return { sut, loadSurveysRepositoryStub };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });
  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut();

    const surveys = await sut.load();

    expect(surveys).toEqual(mockSurveysModel());
  });
  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementation(() => {
      throw new Error();
    });

    expect(sut.load()).rejects.toThrow();
  });
});
