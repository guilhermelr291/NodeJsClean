//IMPORTANT lembrar que estamos considerando arquivos com a extensão .test como testes de integração.
import request from 'supertest';
import app from '../config/app';

describe('Body Parser Middleware', () => {
  //precisamos de um bodyParser pq, por default, as rotas do express não sabem fazer parse de json no post e no put, então precisamos configurar o express pra isso.
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      //criando rota somente para usar no teste.
      res.send(req.body);
    });
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Guilherme' })
      .expect({ name: 'Guilherme' });
  });
});
