//por default, a api so funciona dentro do mesmo servidor. Como vamos receber requisição de outro lugar, temos que usar o cors.

import request from 'supertest';

import app from '../config/app';

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('');
      //poderíamos usar o .json para retornar direto um json. caso o desenvolvedor erre e use um .send,
      // estaremos garantindo q o content-type sera json
    });
    await request(app).get('/test_content_type').expect('content-type', /json/); //notar que estamos passando
    //uma expressão regular aqui. pode ser um application/json, etc. Estamos so verificando se existe um json ali no meio.
  });
  test('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/);
  });
});
