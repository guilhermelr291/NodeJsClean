import {
  AddSurveyParams,
  AddSurveyRepository,
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols';
import {
  LoadSurveysRepository,
  SurveyModel,
} from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById
{
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.insertOne(surveyData);
  }
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    let surveys: any = await surveyCollection.find().toArray();
    surveys = surveys.map(item => MongoHelper.map(item));
    return surveys;
  }
  async loadById(_id: ObjectId): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({
      _id,
    });

    return survey && MongoHelper.map(survey);
  }
}
