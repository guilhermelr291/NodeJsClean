import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-resullt-repository';
import { mockSurveyResultModel } from './mock-survey-result';
import { SurveyResultModel } from '../models/survey-result';
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result';

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class saveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return new Promise(resolve => resolve(mockSurveyResultModel()));
      }
    }
    return new saveSurveyResultRepositoryStub();
  };
