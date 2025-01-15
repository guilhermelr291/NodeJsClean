import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    //melhor usar o .then do q fazer um função async. assim, garantimos
    //que o servidor vai rodar somente dps q o mongo conectar.
    const app = (await import('../main/config/app')).default;
    //vamos importar o app aqui dentro, pra n correr risco dele estar importando
    //algum módulo que depende do bd antes de ele estar conectado.
    app.listen(5050, () => {
      console.log('Server running at: http://localhost:5050');
    });
  })
  .catch(console.error);
