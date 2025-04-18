//por default, a api so funciona dentro do mesmo servidor. Como vamos receber requisição de outro lugar, temos que usar o cors.

import request from 'supertest';
import { noCache } from './no-cache';
import app from '../config/app';

describe('NoCache Middleware', () => {
  test('Should disable cache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_no_cache')
      .expect(
        'cache-control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      )
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
