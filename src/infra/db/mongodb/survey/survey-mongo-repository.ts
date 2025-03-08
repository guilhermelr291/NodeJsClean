import {
  AddSurveyModel,
  AddSurveyRepository,
} from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import {
  LoadSurveysRepository,
  SurveyModel,
} from '../../../../data/usecases/load-surveys/db-load-surveys-protocols';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.insertOne(surveyData);
  }
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    let surveys: any = await surveyCollection.find().toArray();
    surveys = surveys.map(item => MongoHelper.map(item));
    return surveys;
  }
}
