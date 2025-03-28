import {
  SaveSurveyResult,
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {
    this.saveSurveyResultRepository = saveSurveyResultRepository;
  }

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepository.save(data);
    return survey;
  }
}
