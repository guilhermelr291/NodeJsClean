import {
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {
    this.saveSurveyResultRepository = saveSurveyResultRepository;
  }

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepository.save(data);
    return survey;
  }
}
