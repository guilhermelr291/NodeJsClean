import { SurveyResultModel } from '@/domain/models/survey-result';

import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import {
  SaveSurveyResult,
  SaveSurveyResulParams,
} from '@/domain/usecases/survey-result/save-survey-result';

export class SurveyResultMongoRepository implements SaveSurveyResult {
  async save(data: SaveSurveyResulParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    );
    const result = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
      },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true, returnDocument: 'after' }
    );

    return result && MongoHelper.map(result);
  }
}
