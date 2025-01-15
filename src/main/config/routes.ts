import { Express, Router } from 'express';
import fg from 'fast-glob';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router); //adicionando o /api, nao precisamos colocar o /api em tds as rotas. ex: /api/signup...
  fg.sync('**/src/main/routes/**routes.ts').map(
    async file => (await import(`../../../${file}`)).default(router) //quando vamos usar o import fora do escopo global,
    // temos que usar assim. import()
    //o .default retorna uma funcao. ja podemos passar o router direto
    //nossa função da rota vai receber um router. importamos a passamos o router pra ela.
    //quando fazemos um import assim, n conseguimos dar o nome pra ele. vamos pegar o default do arquivo e chamar com o .default
    //como ele pega o caminho a partir do src, temos q voltar ate o src e concatenar.
  ); //vai retornar uma lista com o path completo de cada arquivo.
};
