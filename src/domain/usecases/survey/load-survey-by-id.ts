import { ObjectId } from 'mongodb';
import { SurveyModel } from '../../models/survey';

export interface LoadSurveyById {
  loadById(_id: ObjectId): Promise<SurveyModel>;
}
