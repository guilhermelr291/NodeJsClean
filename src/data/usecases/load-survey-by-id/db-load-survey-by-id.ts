import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id';
import { SurveyModel } from '../load-surveys/db-load-surveys-protocols';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {
    this.loadSurveyByIdRepository = loadSurveyByIdRepository;
  }
  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);

    return survey;
  }
}
