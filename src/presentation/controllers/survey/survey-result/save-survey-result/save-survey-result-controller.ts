import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult,
} from './save-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';
import { ObjectId } from 'mongodb';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {
    this.saveSurveyResult = saveSurveyResult;
    this.loadSurveyById = loadSurveyById;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;

      const survey = await this.loadSurveyById.loadById(
        ObjectId.createFromHexString(surveyId)
      );

      if (survey) {
        const answers = survey.answers.map(a => a.answer);
        if (!answers.includes(answer))
          return forbidden(new InvalidParamError('answer'));
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        answer,
        surveyId,
        date: new Date(),
      });
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
