import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  // client: MongoClient, aqui tem um conflito. dessa forma, em um obj,
  // estamos atribuindo um valor e nao definindo o tipo. temos q declarar
  // e depois fazer o cast
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL); //url setada pelo jest-mongodb no
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
};
