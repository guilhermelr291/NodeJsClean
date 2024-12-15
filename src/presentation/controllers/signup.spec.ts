import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  //geralmente, botamos na descrição o nome do componente que estamos testando.
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController(); //IMPORTANT começamos sempre com a instancia da classe que estamos testando. costumamos chamar esse instancia de 'sut'(system under test).
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest); //a funcao do controlador e controla a requisicão, validar o request e retornar um response valido.
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name')); //IMPORTANT toBe não pode ser usado para comparar 2 objetos, pois ele compara o ponteiro do objeto.
  }); //podemos começar, primeiramente, testando as validações.

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: email'));
  });
});
