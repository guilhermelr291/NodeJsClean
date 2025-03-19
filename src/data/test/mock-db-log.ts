import { LogErrorRepository } from '../protocols/db/log/log-error-repository';

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    logError(stack: string): Promise<void> {
      //Promise<void> pq n retorna nd, mas, como lida com o bd, é async.

      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};
