import mockDate from 'mockdate';
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultController,
  SaveSurveyResultModel,
  SurveyResultModel,
} from './save-survey-result-controller-protocols';
import { SurveyModel } from '@/domain/models/survey';
import { ObjectId } from 'mongodb';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';

const makeFakeHttpRequest = (): HttpRequest => ({
  params: { surveyId: 'any_survey_id' },
  body: {
    answer: 'any_answer',
    date: new Date(),
  },
  accountId: 'any_account_id',
});
const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'valid_id',
  accountId: 'valid_account_id',
  surveyId: 'valid_survey_id',
  answer: 'valid_answer',
  date: new Date(),
});

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()));
    }
  }

  return new SaveSurveyResultStub();
};
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(_id: ObjectId): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()));
    }
  }

  return new LoadSurveyByIdStub();
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );
  return { sut, saveSurveyResultStub, loadSurveyByIdStub };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      params: { surveyId: 'any_survey_id' },
      body: {
        answer: 'wrong_answer',
      },
    });

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(saveSpy).toHaveBeenLastCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer',
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('Should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()));
  });
});
