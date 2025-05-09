import { SurveyModel } from '@/domain/models/survey';
import { mockSurvey, mockSurveysModel } from '@/domain/test';
import {
  AddSurvey,
  AddSurveyParams,
} from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { ObjectId } from 'mongodb';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveysModel()));
    }
  }

  return new LoadSurveysStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(_id: ObjectId): Promise<SurveyModel> {
      return new Promise(resolve => resolve(mockSurvey()));
    }
  }

  return new LoadSurveyByIdStub();
};
