import MockDate from 'mockdate';
import {
  DbSaveSurveyResult,
  SaveSurveyResultRepository,
} from './db-save-survey-result-protocols';
import {
  mockSurveyResultModel,
  mockFakeSurveyResultParams,
} from '@/domain/test/mock-survey-result';
import { mockSaveSurveyResultRepository } from '@/domain/test/mock-db-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub: saveSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = mockFakeSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });
  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(sut.save(mockFakeSurveyResultParams())).rejects.toThrow();
  });

  test('Should return a SurveyResult on success ', async () => {
    const { sut } = makeSut();

    const survey = await sut.save(mockFakeSurveyResultParams());
    expect(survey).toEqual(mockSurveyResultModel());
  });
});
