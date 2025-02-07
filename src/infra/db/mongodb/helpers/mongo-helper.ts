import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  // client: MongoClient, aqui tem um conflito. dessa forma, em um obj,
  // estamos atribuindo um valor e nao definindo o tipo. temos q declarar
  // e depois fazer o cast
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri); //url setada pelo jest-mongodb no
    this.uri = uri;
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  //IMPORTANT uma boa prática é sempre verificarmos se o Client está desconectado ou nulo e, se estiver, reconectar. Isso evita erros.
  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.topology?.isConnected()) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },
};
