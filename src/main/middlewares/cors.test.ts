//por default, a api so funciona dentro do mesmo servidor. Como vamos receber requisição de outro lugar, temos que usar o cors.

import request from 'supertest';

import app from '../config/app';

describe('CORS Middleware', () => {
  test('Should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
