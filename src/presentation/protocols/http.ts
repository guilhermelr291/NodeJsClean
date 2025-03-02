export interface HttpResponse {
  statusCode: number;
  body: any; //pode ser qualquer tipo de objetivo, por isso o any.
}

export interface HttpRequest {
  headers?: any;
  body?: any; //o body é opcional, pois o get, por ex, n usa o body e sim req.params, query, etc..
}
