import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/protocols';

//importante termos a interface aqui.
//poderá receber qualquer controller que implemente essa interface Controller.
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body, //no nosso controller estamos pegando so o body,
      //então mapeamos só ele aqui.
    };
    const httpResponse = await controller.handle(httpRequest);

    //estamos fazendo esse if pois na resposta está indo com o nome do error, em vez da mensagem, ja que mandamos o erro no body.
    if (httpResponse.statusCode >= 200 || httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message }); //message do Error. ServerError, por ex.
    }
  }; //vms executar a função no router,
  // q vai retornar exatamente isso, q o express espera.
  //async pq nosso handle do controller é async
};
