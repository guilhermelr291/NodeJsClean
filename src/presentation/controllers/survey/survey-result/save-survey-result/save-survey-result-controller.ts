import { forbidden } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult,
} from './save-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {
    this.saveSurveyResult = saveSurveyResult;
    this.loadSurveyById = loadSurveyById;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId
    );

    if (!survey) return forbidden(new InvalidParamError('surveyId'));

    await this.saveSurveyResult.save(httpRequest.body);
    return null;
  }
}
