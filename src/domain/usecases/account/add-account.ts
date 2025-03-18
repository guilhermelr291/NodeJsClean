import { ObjectId } from 'mongodb';
import { AccountModel } from '@/domain/models/account';

export type AddAccountParams = {
  name: string;
  email: string;
  password: string;
  _id?: ObjectId;
};

export interface AddAccount {
  add(account: AddAccountParams): Promise<AccountModel>;
}
