import { ObjectId } from 'mongodb';
import {
  LoadSurveyById,
  LoadSurveyByIdRepository,
  SurveyModel,
} from './db-load-survey-by-id-protocols';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {
    this.loadSurveyByIdRepository = loadSurveyByIdRepository;
  }
  async loadById(_id: ObjectId): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(_id);

    return survey;
  }
}
