import {
  AddSurveyModel,
  AddSurveyRepository,
} from '@/data/usecases/add-survey/db-add-survey-protocols';
import {
  LoadSurveysRepository,
  SurveyModel,
} from '@/data/usecases/load-surveys/db-load-surveys-protocols';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById
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
  async loadById(_id: ObjectId): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({
      _id,
    });

    return survey && MongoHelper.map(survey);
  }
}
