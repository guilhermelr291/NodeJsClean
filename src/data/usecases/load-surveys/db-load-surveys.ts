import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel,
} from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {
    this.loadSurveysRepository = loadSurveysRepository;
  }
  async load(): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll();
    return null;
  }
}
