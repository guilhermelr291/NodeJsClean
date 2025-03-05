import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '../../presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };
    const httpResponse = await middleware.handle(httpRequest);

    console.log('httpResponse middleware: ', httpResponse);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body); //vamos colocar dentro do request do express tudo que o nosso middleware retornou.
      next();
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message });
    }
  };
};
