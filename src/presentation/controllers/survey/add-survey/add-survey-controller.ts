import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);

    return new Promise(resolve => resolve(null));
  }
}
