import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { Authentication } from '@/domain/usecases/account/authentication';
import env from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  return dbAuthentication;
};
