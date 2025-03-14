import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';
import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token/db-load-account-by-token';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter';
import env from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
