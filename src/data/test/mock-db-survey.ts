import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/models/survey';
import { mockSurvey, mockSurveysModel } from '@/domain/test/mock-survey';
import { ObjectId } from 'mongodb';
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(_id: ObjectId): Promise<SurveyModel> {
      return new Promise(resolve => resolve(mockSurvey()));
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveysModel()));
    }
  }

  return new LoadSurveysRepositoryStub();
};
