import { SurveyModel } from '@/domain/models/survey';
import { ObjectId } from 'mongodb';

export interface LoadSurveyByIdRepository {
  loadById(_id: ObjectId): Promise<SurveyModel>;
}
