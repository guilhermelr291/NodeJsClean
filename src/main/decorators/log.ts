import { LogErrorRepository } from '../../data/protocols/db/log-error-repository';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

//Aqui, vamos aplicar o decorator. O padrão se resume em pegar um objeto e criar um wrapper em volta dele.
//Dessa forma, não estaremos acoplando o Logger a nenhum controller. Como nao é um use-case, não tem necessidade de acoplarmos.
//o decorator precisa ter a mesma assinatura da classe que vamos decorar. Como o SignUp Controller implementa a interface Controller, basta implementarmos também.
// a classe que vamos decorar precisa ser do mesmo tipo da classe que estamos implementando.
// recebemos a classe que vamos decorar no construtor.
//agora, sempre que criarmos uma factory para um controller, em vez de retornar o controller, vamos retornar o decorator englobando esse controller.
//como o decorator tem comportamento, vale a pena criar um teste pra ele, diferente da factory q n tem.
export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErrorRepository: LogErrorRepository;
  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest); //nosso controller retorna um ok() um ou ServerError(). Se retornar um serverError, podemos fazer um log aqui mesmo, preservando o comportamento da classe original.

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
