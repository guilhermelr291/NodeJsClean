import { ObjectId } from 'mongodb';
import { AccountModel } from '@/domain/models/account';

export type AddAccountModel = {
  name: string;
  email: string;
  password: string;
  _id?: ObjectId;
};

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}
